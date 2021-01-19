import { SerializeProperty, Serializable, Serialize } from "../utility/ts-serializer";

// 单个字的内容
@Serialize({})// 序列化
export class ChineseWord extends Serializable {
    @SerializeProperty()
    word: string;

    @SerializeProperty()
    pinyin: Pinyin;

    radical: string;

    characterId: string;

    characterUpdateTime: string;

    strokesCount: number;

    pinyins: Pinyin[];

    smallImg: string;

    isEnoughInfo: boolean = false;// 课件打开时 从接口获取到文字相关信息后此字段置为true，否则置为false；

    constructor(params) {
        super();
        this.word = params.word;
        this.pinyin = params.pinyin;
        this.radical = params.radical;
        this.strokesCount = params.strokesCount;
        this.pinyins = params.pinyins;
        this.characterUpdateTime = params.characterUpdateTime;
        this.characterId = params.characterId;
        this.isEnoughInfo = params.isEnoughInfo;
    }
}
@Serialize({})// 序列化
export class Pinyin extends Serializable {
    @SerializeProperty()
    phonetic: string;// hao

    @SerializeProperty()
    fullPhonetic: string;// hǎo

    @SerializeProperty()
    phoneticId: number;

    @SerializeProperty()
    phoneticUpdateTime: string;

    constructor(phonetic: string, fullPhonetic: string, phoneticId: number, phoneticUpdateTime: string) {
        super();
        this.phonetic = phonetic;
        this.fullPhonetic = fullPhonetic;
        this.phoneticId = phoneticId;
        this.phoneticUpdateTime = phoneticUpdateTime;
    }
}
