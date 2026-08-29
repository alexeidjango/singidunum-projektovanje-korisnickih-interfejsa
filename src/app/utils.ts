import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

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
}
