<template>
    <div id="tips">
        <div>
            <span
                :class="(password && (isOne || isTwo || isThree || isFour || isFive || isSix || isSeven)) ? 'colorRed' : 'colorInit'"></span>
            <span :class="(isTwo || isThree || isFour || isFive || isSix || isSeven) ? 'colorRed ' : 'colorInit'"></span>
            <span :class="(isThree || isFour || isFive || isSix || isSeven) ? 'colorOrange ' : 'colorInit'"></span>
            <span :class="(isFour || isFive | isSix || isSeven) ? 'colorOrange' : 'colorInit'"></span>
            <span :class="(isFive || isSix || isSeven) ? 'colorGreen' : 'colorInit'"></span>
            <span :class="(isSix || isSeven) ? 'colorGreen' : 'colorInit'"></span>
            <span :class="isSeven ? 'colorSafe' : 'colorInit'"></span>
            <span v-show="password" class="left5"> {{ psdstrength }} </span>
        </div>
    </div>
</template>
  
<script>
function checkPassword(str) {
    // 第一步先判断各分类长度
    let num = 0; //数字
    let lowerCase = 0; //小写字母
    let upperCase = 0; //大写字母
    let special = 0; //特殊字符
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c >= 48 && c <= 57) {
            //数字
            num++;
        } else if (c >= 65 && c <= 90) {
            //大写字母
            upperCase++;
        } else if ((c = 97 && c <= 122)) {
            //小写字母
            lowerCase++;
        } else {
            special++;
        }
    }
    // 第二步 计算分数
    let wholeMark = 0;
    let numMark = 0;
    let caseMark = 0;
    let specialMark = 0;
    let reward = 0;
    // 整长度分数
    if (str.length <= 4) {
        wholeMark = 5;
    } else if (str.length > 4 && str.length <= 8) {
        wholeMark = 10;
    } else {
        wholeMark = 25;
    }
    // 奖励分数
    if ((lowerCase || upperCase) && num) {
        reward = 2;
        if (special) {
            reward = 3;
            if (lowerCase && upperCase) {
                reward = 5;
            }
        }
    }
    // 字母分数
    if (lowerCase || upperCase) {
        caseMark = 10;
        if (lowerCase && upperCase) {
            caseMark = 20;
        }
    }
    // 数字分数
    if (num) {
        numMark = 10;
        if (num >= 3) {
            numMark = 20;
        }
    }
    // 符号分数
    if (special) {
        specialMark = 10;
        if (special > 1) {
            specialMark = 25;
        }
    }
    let totalMark = wholeMark + numMark + caseMark + specialMark + reward;
    let strength = "";
    if (totalMark < 15) {
        strength = "非常弱";
    } else if (totalMark >= 15 && totalMark < 25) {
        strength = "弱";
    } else if (totalMark >= 25 && totalMark < 40) {
        strength = "一般";
    } else if (totalMark >= 40 && totalMark < 50) {
        strength = "强";
    } else if (totalMark >= 50 && totalMark < 60) {
        strength = "非常强";
    } else if (totalMark >= 60 && totalMark < 80) {
        strength = "安全";
    } else {
        strength = "非常安全";
    }
    return strength;
}
export default {
    name: "PsdStrength",
    components: {},
    props: ['password'],
    watch: {
        password(newVal, oldVal) {
            this.onPasswordChange(newVal)
        }
    },
    data() {
        return {
            // password: "",
            isOne: false,
            isTwo: false,
            isThree: false,
            isFour: false,
            isFive: false,
            isSix: false,
            isSeven: false,
            psdstrength: ""
        };
    },
    methods: {
        onPasswordChange(val) {

            this.isOne = false;
            this.isTwo = false;
            this.isThree = false;
            this.isFour = false;
            this.isFive = false;
            this.isSix = false;
            this.isSeven = false;
            //   const psdVal = val.target.value;
            const psdVal = val;
            if (!psdVal) return;
            const psdStrength = checkPassword(psdVal);
            this.psdstrength = psdStrength;
            switch (psdStrength) {
                case "非常弱":
                    this.is0ne = true;
                    break;
                case "弱":
                    this.isTwo = true;
                    break;
                case "一般":
                    this.isThree = true;
                    break;
                case "强":
                    this.isFour = true;
                    break;
                case "非常强":
                    this.isFive = true;
                    break;
                case "安全":
                    this.isSix = true;
                    break;
                case "非常安全":
                    this.isSeven = true;
                    break;
                default:
                    break;
            }
        },
    },
    created() { },
};
</script>
  
<style>
#tips span:not(:last-child) {
    float: left;
    width: 30px;
    height: 20px;
    border: 1px solid transparent;
    font-size: 15px;
    margin-right: 2px;
    line-height: 20px;
    text-align: center;
}

.left5 {
    margin-left: 5px;
    float: left;
    height: 20px;
    font-size: 15px;
    line-height: 20px;
}

.colorRed {
    background-color: red;
}

.colorOrange {
    background-color: orange;
}

.colorGreen {
    background-color: #54ec51;
}

.colorsafe {
    background-color: #52c41a;
}

.colorInit {
    background: #eeeeee;
}</style>