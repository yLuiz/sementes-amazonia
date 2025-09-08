import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-date',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarDateComponent),
      multi: true,
    },
  ],
  templateUrl: './calendar-date.component.html',
  styleUrls: ['./calendar-date.component.scss'],
})
export class CalendarDateComponent implements OnInit, OnChanges {
  @Input() label = 'Data';
  @Input() allowEmpty = false;          // permite vazio (útil quando campo é opcional)
  @Input() yearSpan = 11;               // quantidade total de anos (ex.: 11 -> atual ±5)
  @Input() startYear?: number;          // opcional: fixa início (sobrepõe yearSpan)
  @Input() endYear?: number;            // opcional: fixa fim (sobrepõe yearSpan)

  disabled = false;

  fg: FormGroup = this.fb.group({
    year: [null],
    month: [null],
    day: [null],
  });

  years: number[] = [];
  months = [
    { value: 1, label: 'Jan' }, { value: 2, label: 'Fev' }, { value: 3, label: 'Mar' },
    { value: 4, label: 'Abr' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' }, { value: 8, label: 'Ago' }, { value: 9, label: 'Set' },
    { value: 10, label: 'Out' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dez' },
  ];
  daysInMonth: string[] = [];

  private onChange: (_: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildYears();

    // Recalcula dias ao iniciar e em qualquer mudança
    this.recalcDays();

    // Emite valor sempre que qualquer parte muda
    this.fg.valueChanges.subscribe(() => {
      const val = this.buildValue();
      this.onChange(val);
    });
  }

  ngOnChanges(_: SimpleChanges): void {
    this.buildYears();
    this.recalcDays();
  }

  // ControlValueAccessor
  writeValue(value: string | null): void {
    if (!value) {
      if (this.allowEmpty) {
        this.fg.reset({ year: null, month: null, day: null }, { emitEvent: false });
      } else {
        const d = new Date();
        this.fg.setValue(
          {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: this.pad(d.getDate()),
          },
          { emitEvent: false }
        );
      }
      this.recalcDays();
      return;
    }

    // Aceita "YYYY-MM-DD" (e ignora qualquer tempo a mais caso venha junto)
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const [, y, mo, d] = m;
      this.fg.setValue(
        {
          year: Number(y),
          month: Number(mo),
          day: d,
        },
        { emitEvent: false }
      );
      this.recalcDays();
    }
  }

  registerOnChange(fn: (_: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) this.fg.disable({ emitEvent: false });
    else this.fg.enable({ emitEvent: false });
  }

  // Helpers
  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  recalcDays(): void {
    const y = Number(this.fg.value.year);
    const m = Number(this.fg.value.month);
    const days = y && m ? new Date(y, m, 0).getDate() : 31;

    const current = Number(this.fg.value.day);
    this.daysInMonth = Array.from({ length: days }, (_, i) => this.pad(i + 1));
    if (current > days) {
      this.fg.patchValue({ day: this.pad(days) }, { emitEvent: false });
    }
  }

  onBlurField() {
    this.onTouched();
  }

  private buildValue(): string | null {
    const { year, month, day } = this.fg.value;
    if (!year || !month || !day) {
      return this.allowEmpty ? null : null;
    }
    const y = String(year);
    const mo = this.pad(Number(month));
    const d = typeof day === 'string' ? day : this.pad(Number(day));
    return `${y}-${mo}-${d}`;
  }

  private buildYears() {
    const now = new Date();
    const current = now.getFullYear();

    if (this.startYear != null && this.endYear != null) {
      this.years = Array.from(
        { length: this.endYear - this.startYear + 1 },
        (_, i) => this.startYear! + i
      );
      return;
    }

    const half = Math.floor(this.yearSpan / 2); // exemplo: 11 -> 5 pra cada lado
    const start = current - half;
    const end = start + this.yearSpan - 1;
    this.years = Array.from({ length: this.yearSpan }, (_, i) => start + i);
  }
}
