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

  private toyTypeOptions: { value: ToyTypeEnum; label: string }[] = [
    { value: ToyTypeEnum.SLAGALICA, label: 'Slagalice' },
    { value: ToyTypeEnum.SLIKOVNICA, label: 'Slikovnice' },
    { value: ToyTypeEnum.FIGURA, label: 'Figure' },
    { value: ToyTypeEnum.EDUKATIVNA, label: 'Edukativne' },
    { value: ToyTypeEnum.DRUSTVENA_IGRA, label: 'Društvene igre' },
    { value: ToyTypeEnum.KONSTRUKCIJA, label: 'Konstrukcije' },
  ];

  getToyTypeOptions() {
    return this.toyTypeOptions;
  }
}
