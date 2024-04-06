import { Injectable } from "@angular/core";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { ToastrService } from "ngx-toastr";
import { Guid } from "typescript-guid";

@Injectable({
    providedIn: 'root'
  })
export class AzureBlobService {
    private accountName: string = "meetandfeetstorage";
    private containerName: string = '';
    // TODO: Store it in .env file
    private sasToken: string = "sp=racwd&st=2024-03-27T17:48:16Z&se=2026-03-31T23:48:16Z&spr=https&sv=2022-11-02&sr=c&sig=XKc8he2%2FdLb%2BMOGfk%2FPlUeQLu3amBrTGXuvD9fFx6vo%3D";
    constructor(
        private toastr: ToastrService,
    ) {}

    public uploadFile(content: Blob, name: string, containerName: string, handler: (response: any) => void) {
        this.containerName = containerName;
        this.uploadBlob(content, `${name}_${Guid.create()}`, this.containerClientWithSas(), handler)
    }

    private uploadBlob(content: Blob, name: string, client: ContainerClient, handler: (response: any) => void) {
        try {
            let blockBlobClient = client.getBlockBlobClient(name);
            blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } })
              .then(
                (response) => handler(response._response.request.url)
              ).catch((error) => {
                this.toastr.error('Failed to upload image to server');
                console.log(error);
              });
        } catch (error) {
            this.toastr.error('Failed to upload image to server');
            console.log(error);
        }
    }

    private containerClient(): ContainerClient {
        return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net`).getContainerClient(this.containerName);
    }
    private containerClientWithSas(): ContainerClient {
        return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${this.sasToken}`).getContainerClient(this.containerName);
    }
}