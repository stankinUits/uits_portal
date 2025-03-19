export class AppSettings {
  public static BASE_URL='/api/department/scientific_publications';
  public static DEFAULT_TAG_STYLE = 'tags_style';
  public static ONCLICK_TAG_STYLE = 'tags_style_onClick';
  public static EMPTY_TAG_SEARCH_TEXT = 'Без выбора';
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
