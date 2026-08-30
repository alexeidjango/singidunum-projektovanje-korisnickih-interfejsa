import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { TargetGroup, ToyType, ToyTypeEnum } from '../models/toy.model';

@Injectable({ providedIn: 'root' })
export class Utils {
  private bs = {
    popup: 'card',
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-secondary',
    denyButton: 'btn btn-danger',
  };

  confirm(text: string, onYes: () => void): void {
    Swal.fire({
      icon: 'question',
      title: text,
      showCancelButton: true,
      confirmButtonText: 'Da',
      cancelButtonText: 'Ne',
      customClass: this.bs,
    }).then((result) => {
      if (result.isConfirmed) onYes();
    });
  }

  private toyTypeLabelsSingle: Record<ToyTypeEnum, string> = {
    [ToyTypeEnum.SLAGALICA]: 'Slagalica',
    [ToyTypeEnum.SLIKOVNICA]: 'Slikovnica',
    [ToyTypeEnum.FIGURA]: 'Figura',
    [ToyTypeEnum.EDUKATIVNA]: 'Edukativna',
    [ToyTypeEnum.DRUSTVENA_IGRA]: 'Društvena igra',
    [ToyTypeEnum.KONSTRUKCIJA]: 'Konstrukcija',
    [ToyTypeEnum.PLISANA_IGRACKA]: 'Plisana Igracka',
    [ToyTypeEnum.KARAKTER]: 'Karakter',
    [ToyTypeEnum.OSTALO]: 'Ostalo',
  };

  private toyTypeLabelsPlural: Record<ToyTypeEnum, string> = {
    [ToyTypeEnum.SLAGALICA]: 'Slagalice',
    [ToyTypeEnum.SLIKOVNICA]: 'Slikovnice',
    [ToyTypeEnum.FIGURA]: 'Figure',
    [ToyTypeEnum.EDUKATIVNA]: 'Edukativne',
    [ToyTypeEnum.DRUSTVENA_IGRA]: 'Društvene igre',
    [ToyTypeEnum.KONSTRUKCIJA]: 'Konstrukcije',
    [ToyTypeEnum.PLISANA_IGRACKA]: 'Plisane Igracke',
    [ToyTypeEnum.KARAKTER]: 'Karakteri',
    [ToyTypeEnum.OSTALO]: 'Ostalo',
  };

  getToyTypeOptions(): { value: ToyTypeEnum; label: string }[] {
    return Object.keys(this.toyTypeLabelsPlural).map((key: string) => ({
      value: key as ToyTypeEnum,
      label: this.toyTypeLabelsPlural[key as ToyTypeEnum],
    }));
  }

  toyTypeLabel(toyType: ToyTypeEnum) {
    return this.toyTypeLabelsPlural[toyType];
  }

  rsd(price: number): string {
    return price.toLocaleString('sr-RS') + ' RSD';
  }

  stars(rating: number): string {
    const n = Math.round(rating);
    return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  groupLabel(g: TargetGroup): string {
    return g === 'svi' ? 'Svi' : g === 'devojcica' ? 'Devojčice' : 'Dečaci';
  }

  typeLabel(t: ToyType): string {
    return this.toyTypeLabelsSingle[t];
  }

  statusBadge(s: string): string {
    return s === 'rezervisano'
      ? 'text-bg-secondary'
      : s === 'pristiglo'
        ? 'text-bg-success'
        : 'text-bg-danger';
  }
}
