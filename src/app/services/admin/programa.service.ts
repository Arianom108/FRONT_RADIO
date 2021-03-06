import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Programa } from '../../modelos/modelo.index';
import { URL_SERVICE } from '../../config/config.config';
import { map } from 'rxjs/internal/operators';
import { forkJoin, Observable } from 'rxjs';
import { AdminService } from '../admin/admin.service';
import { UsuarioService } from './usuario.service';
@Injectable({
    providedIn: 'root'
})
export class ProgramaService  {

    public programas: Programa[];
    constructor(
        public http: HttpClient,
        public _adminService: AdminService,
    ) {
        this.obtenerProgramas().subscribe( (programas: any) => {
            this.programas = programas;
            console.log(this.programas);
        });
     }

   // ===========================
   // Obtener todos los programas
   // ===========================
    obtenerProgramas() {
    const url = `${ URL_SERVICE }/programa`;
    return this.http.get(url).pipe(map((res: any) => {
        return res.programas;
    }));
    }

    // ===========================
   // Obtener programa por id
   // ===========================

   findPrograma(idDePrograma, token?) {
    let url = URL_SERVICE + '/programa/' + idDePrograma;
    url += '?token=' + token;
    return this.http.get(url, idDePrograma);
   }

    // // crearPrograma ( programa: Programa ) {
    // //     let url = `${ URL_SERVICE }/programa`;
    // //     url += '?token=' + this._usuarioService.token;
    // //     return this.http.post( url, programa );
    // // }

    updateProgramas(programas: Programa[], token, idDeUsuario) {
        console.log('UPDATE PRO', programas, idDeUsuario);
        return new Promise ((resolvedor, reject) => {

            const progs = [];
            const observableBatch = [];
            const programasQueTienenAlUsuario = this.programas.filter((programa: Programa) => {
            return programa.colaboradores.includes(idDeUsuario);
            });
            if (programasQueTienenAlUsuario.length >= 0) {
                programasQueTienenAlUsuario.forEach((programa: Programa) => {
                                    const index = programa.colaboradores.indexOf(idDeUsuario);
                                    programa.colaboradores.splice(index, 1);
                                    let url = URL_SERVICE + '/programa/' + programa._id;
                                    url += '?token=' + token;
                                    observableBatch.push(this.http.put(url, programa).pipe(map((res: any) => console.log(res) )));
                });
            }
            programas.forEach((programa) => {
                let url = URL_SERVICE + '/programa/' + programa._id;
                url += '?token=' + token;
                programa.colaboradores.push(idDeUsuario);
                programa.colaboradores = programa.colaboradores.filter((item, index, inputArray ) => {
                        return inputArray.indexOf(item) === index;
                });
                    observableBatch.push(this.http.put(url, programa).pipe(map((res: any) => {
                        console.log(res);
                        progs.push(res.programa);
                    } )));
            });
            const promesa = new Promise((resolve) => {
                return forkJoin (observableBatch).subscribe(() => {
                    resolve();
                });
            });
            promesa.then(() => {
                this.obtenerProgramas().subscribe( (res: any) => {
                    this.programas = res;
                    resolvedor(progs);
                });
            });
        });

    }

    updatePrograma(programa, token) {
        let url = URL_SERVICE + '/programa/' + programa._id;
        url += '?token=' + token;
       return this.http.put(url, programa).pipe(map((res) => {
              if ( <any>false) {
                this.obtenerProgramas().subscribe( (resp: any) => {
                    this.programas = resp;
                });
              }
              return res;
            }));
    }

    crearPrograma(programa, token) {
        let url = URL_SERVICE + '/programa';
        url += '?token=' + token;
        return this.http.post(url, programa).pipe(map((res) => {
            return res;
        }));
    }

     getAllIndexes(arr, val) {
        const indexes = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    cambiarImagen( archivo: File, coleccion: string, id: string, ) {
        if (!archivo || archivo === undefined ) {
            return;
        }

       return this._adminService.subirArchivo( archivo, coleccion , id );
       }

    subirImagen( archivo: File, tipo: string ) {
        if (!archivo || archivo === undefined ) {
            return;
        }
        return this._adminService.subirImagen(archivo, tipo);
    }


    removePrograma(programaID, token?) {
        let url = URL_SERVICE + '/programa/' + programaID;
        url += '?token=' + token;
        return this.http.delete(url).pipe(map((res: any) => {
            return res.programa;
        }));
    }


}
