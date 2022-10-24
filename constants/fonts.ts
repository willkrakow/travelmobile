const regular = "Regular"
const bold = "Bold";
const thin = "Thin";


type FontWeight = "regular" | "bold" | "thin" | "light" | "boldItalic" | "black" | "italic"
class Font {
  private _name: string;
  private _weights: FontWeight[];
  defaultWeight: string;

  constructor(name: string, weights: FontWeight[]) {
    this._name = name;
    this._weights = weights;
    this.defaultWeight = `${name}-Regular`;
  }
  get name() {
    return this._name;
  }

  private hasWeight(weight: FontWeight) {
    return this._weights.includes(weight);
  }
  get regular() {
    if (!this.hasWeight("regular")) {
      throw new Error("Font does not have regular weight");
    }
    return `${this._name}-Regular`;
  }

  get light(){
    if (!this.hasWeight("light")) {
      return this.defaultWeight;
    }
    return `${this._name}-Light`;
  }

  get thin() {
    if (!this.hasWeight("thin")) {
      return this.defaultWeight;
    }
    return `${this._name}-Thin`;
  }

  get bold() {
    if (!this.hasWeight("bold")) {
      return this.defaultWeight;
    }
    return `${this._name}-Bold`;
  }

  get black() {
    if (!this.hasWeight("black")) {
      return this.defaultWeight;
    }
    return `${this._name}-Black`;
  }

  get boldItalic() {
        if(!this.hasWeight("boldItalic")){
            return this.defaultWeight
        }
        return `${this._name}-BoldItalic`
  }

  get italic (){
    if (!this.hasWeight("italic")) {
      return this.defaultWeight;
    }
    return `${this._name}-Italic`;
  }
}



export const lobsterTwo = new Font("LobsterTwo", ["bold", "boldItalic", "regular", "italic"]);
export const inter = new Font("Inter", ["black", "bold", "light", "regular", "thin"]);