import {inject} from '@loopback/core';
import {
  get,
  HttpErrors,
  oas,
  param,
  Response,
  RestBindings
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {Keys as llaves} from '../config/keys';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
export class DescargaArchivoController {

  constructor(
  ) { }

  @get('/files', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles() {
    const rutaCarpeta = path.join(__dirname, llaves.carpetaImagen);
    const archivos = await readdir(rutaCarpeta);
    return archivos;
  }

  @get('/files/{filename}')
  @oas.response.file()
  async downloadFile(
    @param.path.string('filename') filename: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const rutaCarpeta = path.join(__dirname, llaves.carpetaImagen);
    const archivo = this.ValidateFileName(rutaCarpeta, filename);
    //console.log("folder: " + folder)
    //console.log("fname: " + fileName)
    response.download(archivo, rutaCarpeta);
    return response;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private ValidateFileName(archivo: string, folder: string) {
    const resolved = path.resolve(archivo, folder);
    if (resolved.startsWith(archivo)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors[400](`La ruta del archivo es inválida: ${folder}`);
  }
}

