export class CustomQueryModel {
  attributes: CustomQueryAttributes;
  type: string;
}
export class CustomQueryAttributes {
  fields: string;
  title: string;
}

export interface CustomQueryService extends CustomQueryModel {}
