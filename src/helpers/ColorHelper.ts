export class ColorHelper{
  public static getRandomColor(): string{
    const random = Math.round(Math.random()* (ColorHelper._colors.length-1));
    return this._colors[random];
  }

  private static _colors: string[]=[
    '#ff22cc88',
    '#db4815',
    '#762822',
    '#7c6b1c',
    '#820bae',
    '#dabf25',
    '#428558',
    '#1262cf',
    '#240640',
    '#8f4c0d',
    '#d90c0c'
  ]
}