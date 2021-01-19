import fangge from 'asset/img/fangge.png';
import tianzige from 'asset/img/tianzige.png';
import mizige from 'asset/img/mizige.png';
import sixiange from 'asset/img/sixiange.png';
import sixiansange from 'asset/img/sixiansange.png';
import pinyintianzige from 'asset/img/pinyintianzige.png';
import map from 'asset/img/map.jpg';
import map2 from 'asset/img/map2.jpg';

const templateConfig = [
    {
        name: "Default",
        icon: "",
        image: "",
        type: "image",
        desp: "空白",
        groupName: "练习格",
        isShow: true
    },
    {
        name: "FangGe",
        icon: fangge,
        image: "",
        type: "draw",
        desp: "方格",
        groupName: "练习格",
        isShow: true
    },
    {
        name: "TianZiGe",
        icon: tianzige,
        image: "",
        type: "draw",
        desp: "田字格",
        groupName: "练习格",
        isShow: true
    },
    {
        name: "MiZiGe",
        icon: mizige,
        image: "",
        type: "draw",
        desp: "米字格",
        groupName: "练习格",
        isShow: true
    },
    {
        name: "SiXianGe",
        icon: sixiange,
        image: "",
        type: "draw",
        desp: "四线格",
        groupName: "练习格",
        isShow: true
    },
    {
        name: "SiXianSanGe",
        icon: sixiansange,
        image: "",
        type: "draw",
        desp: "四线三格",
        groupName: "练习格",
        isShow: true
    },
    {
        name: "PinYinTianZiGe",
        icon: pinyintianzige,
        image: "",
        type: "draw",
        desp: "拼音田字格",
        groupName: "练习格",
        isShow: true
    },
    {
        name: "DQGZ",
        icon: "",
        image: map,
        type: "image",
        desp: "地球公转示意图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "DGX",
        icon: "",
        image: map2,
        type: "image",
        desp: "等高线地形图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "SJHL",
        icon: "",
        image: map2,
        type: "image",
        desp: "世界海陆分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "SJQHLX",
        icon: "",
        image: map2,
        type: "image",
        desp: "世界气候类型分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "SJRK",
        icon: "",
        image: map2,
        type: "image",
        desp: "世界人口分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "YZQHLX",
        icon: "",
        image: map2,
        type: "image",
        desp: "亚洲气候类型分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "DNYDQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "东南亚地区图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "ZDSYFB",
        icon: "",
        image: map2,
        type: "image",
        desp: "中东石油分布与输出路线图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "OZXBZQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "欧洲西部政区图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "OZXBZQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "欧洲西部政区图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "JDDQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "极地地区图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "MGNYD",
        icon: "",
        image: map2,
        type: "image",
        desp: "美国农业带分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "ZGJY",
        icon: "",
        image: map2,
        type: "image",
        desp: "中国疆域示意图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "ZGDX",
        icon: "",
        image: map2,
        type: "image",
        desp: "中国地形分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "ZGZYQHLX",
        icon: "",
        image: map2,
        type: "image",
        desp: "中国主要气候类型分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "ZGZYHL",
        icon: "",
        image: map2,
        type: "image",
        desp: "中国主要河流的分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "ZGZYTLGX",
        icon: "",
        image: map2,
        type: "image",
        desp: "中国主要铁路干线及铁路枢纽图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "ZGGY",
        icon: "",
        image: map2,
        type: "image",
        desp: "中国工业分布图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "SDDLQY",
        icon: "",
        image: map2,
        type: "image",
        desp: "四大地理区域划分图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "BFDQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "北方地区图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "HTGY",
        icon: "",
        image: map2,
        type: "image",
        desp: "黄土高原略图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "NFDQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "南方地区图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "TWSL",
        icon: "",
        image: map2,
        type: "image",
        desp: "台湾省略图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "XBDQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "西北地区图",
        groupName: "地理",
        isShow: false
    },
    {
        name: "QZDQ",
        icon: "",
        image: map2,
        type: "image",
        desp: "青藏地区图",
        groupName: "地理",
        isShow: false
    }
];

const bgColorConfig = [
    {
        name: "gray",
        color: "#EDEDED",
        penColor: ["#2E2E2E", "#FA5D3E", "#4F90EA"],
        penColorName: ["black", "red", "blue"],
        gridColor: "#666666",
    },
    {
        name: "black",
        color: "#1E1D1D",
        penColor: ["#FFFFFF", "#FA5D3E", "#4F90EA"],
        penColorName: ["white", "red", "blue"],
        gridColor: "#FFFF00",
    },
    {
        name: "darkGreen",
        color: "#004834",
        penColor: ["#2E2E2E", "#FFFFFF", "#FA5D3E", "#4F90EA"],
        penColorName: ["black", "white", "red", "blue"],
        gridColor: "#FFFF00",
    },
    {
        name: "green",
        color: "#02746c",
        penColor: ["#2E2E2E", "#FFFFFF", "#FA5D3E", "#4F90EA"],
        penColorName: ["black", "white", "red", "blue"],
        gridColor: "#FFFF00",
    }
]

export { templateConfig, bgColorConfig };
