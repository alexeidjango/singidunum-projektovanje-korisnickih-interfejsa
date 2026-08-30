import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ToyType, ToyTypeEnum } from '../models/toy.model';

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

  private toyTypeLabels: Record<ToyTypeEnum, string> = {
    [ToyTypeEnum.SLAGALICA]: 'Slagalice',
    [ToyTypeEnum.SLIKOVNICA]: 'Slikovnice',
    [ToyTypeEnum.FIGURA]: 'Figure',
    [ToyTypeEnum.EDUKATIVNA]: 'Edukativne',
    [ToyTypeEnum.DRUSTVENA_IGRA]: 'Društvene igre',
    [ToyTypeEnum.KONSTRUKCIJA]: 'Konstrukcije',
    [ToyTypeEnum.PLISANA_IGRACKA]: 'Plisana Igracka',
    [ToyTypeEnum.KARAKTER]: 'Karakter',
    [ToyTypeEnum.OSTALO]: 'Ostalo',
  };

  private toyTypeOptions: { value: ToyTypeEnum; label: string }[] = [
    { value: ToyTypeEnum.SLAGALICA, label: 'Slagalice' },
    { value: ToyTypeEnum.SLIKOVNICA, label: 'Slikovnice' },
    { value: ToyTypeEnum.FIGURA, label: 'Figure' },
    { value: ToyTypeEnum.EDUKATIVNA, label: 'Edukativne' },
    { value: ToyTypeEnum.DRUSTVENA_IGRA, label: 'Društvene igre' },
    { value: ToyTypeEnum.KONSTRUKCIJA, label: 'Konstrukcije' },
  ];

  getToyTypeOptions(): { value: ToyTypeEnum; label: string }[] {
    return Object.keys(this.toyTypeLabels).map((key: string) => ({
      value: key as ToyTypeEnum,
      label: this.toyTypeLabels[key as ToyTypeEnum],
    }));
  }

  toyTypeLabel(toyType: ToyTypeEnum) {
    return this.toyTypeLabels[toyType];
  }

  rsd(price: number): string {
    return price.toLocaleString('sr-RS') + ' RSD';
  }

  stars(rating: number): string {
    const n = Math.round(rating);
    return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);
  }
}
