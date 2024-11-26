export class AppSettings {
  public static BASE_URL='http://127.0.0.1:8000/api/editable-pages/scientific_publications';
  public static isAdmin: boolean = false;
  public static DEFAULT_TAG_STYLE = 'tags_style';
  public static ONCLICK_TAG_STYLE = 'tags_style_onClick';
  public static EMPTY_TAG_SEARCH_TEXT: string = 'Без выбора';
  public static PDF_MIME_TYPE = 'application/pdf';

  public static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

}
