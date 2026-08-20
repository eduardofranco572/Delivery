export class AddressDto {
    cep!: string;
    street!: string;
    number!: string;
    neighborhood!: string;
    city!: string;
    state!: string;
    type?: string;
    isDefault?: boolean;
}