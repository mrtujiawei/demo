const scrollNumber = `
<template>
  <span class="scroll-number relative">
    <template v-for="(item, index) in renderValue" :key="index">
      <Item v-if="isNumber(item)" :value="Number(item)" :animate="animate" :order="order"></Item>
      <span v-else>{{ item }}</span>
    </template>
    <span class="absolute -right-[25px] w-[26px] h-[50px] overflow-hidden pointer-events-none">
      <span class="inline-block w-full h-full arrow-ani" v-show="arrowAni">
        <Arrow></Arrow>
      </span>
    </span>
  </span>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Item from './item.vue'
import Decimal from 'decimal.js'
import Arrow from '../arrow/index.vue'

const props = defineProps({
  value: String,
  animate: {
    type: Boolean,
    default: true,
  },
  arrowAnimate: {
    type: Boolean,
    default: false,
  },
  calcFlag: {
    type: Number,
    default: 0,
  },
})

const renderValue = ref(props.value)
const order = ref(0)
const arrowAni = ref(false)

const numReg = /[^\d\.]/g
const flag = computed(() => {
  return {
    value: props.value,
    flag: props.calcFlag,
  }
})

watch(
  () => flag.value,
  () => {
    order.value = new Decimal(String(props.value).replace(numReg, '')).comparedTo(
      new Decimal(String(renderValue.value).replace(numReg, '')),
    )

    if (props.arrowAnimate && order.value < 0) {
      arrowAni.value = true
      setTimeout(() => {
        arrowAni.value = false
        setTimeout(() => {
          renderValue.value = props.value
        }, 100)
      }, 1000)
    } else {
      renderValue.value = props.value
    }
  },
)

const numberReg = /^\d$/
const isNumber = (val) => numberReg.test(val)
</script>

<style scoped>
.scroll-number {
  height: 100%;
  display: inline-block;
}

.arrow-ani {
  animation: slide ease-in-out 1s forwards;
}

@keyframes slide {
  0% {
    transform: translateY(-100%);
  }
  60% {
    transform: translateY(0);
    opacity: 1;
  }
  90% {
    transform: translateY(0) scaleY(50%);
    transform-origin: bottom center;
    opacity: 0.6;
  }
  100% {
    opacity: 0;
    transform: translateY(0%) scaleY(30%);
    transform-origin: bottom center;
  }
}
</style>
`;

const Item = `
<template>
  <span class="number-wrap">
    <span
      v-for="item in 30"
      :key="item"
      :style="{
        transform,
        transition: transition ? 'all cubic-bezier(0.00, 0.3, 0.00, 1) \${duration}ms' : 'none',
      }"
      class="number-item"
    >
      {{ (item - 1) % 10 }}
    </span>
  </span>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  animate: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Number,
  },
})

const val = ref(props.value)
const transition = ref(false)
const duration = ref(0)

const transform = computed(() => \`translateY(\${val.value * -100}%)\`)

watch(
  () => props.value,
  async () => {
    const order = props.order
    const preValue = val.value
    let newValue = props.value

    if (preValue == newValue) {
      return
    }

    if (order < 0) {
      // 值减少
      if (newValue > preValue) {
        newValue -= 10
      }
    } else if (order > 0) {
      // 值增加
      while (newValue < preValue) {
        newValue += 10
      }
    }

    const diff = Math.abs(newValue - preValue)

    const MIN = 1000
    const MAX = 2000
    duration.value = Math.min(MAX, Math.max(MIN, diff * 100))

    transition.value = props.animate
    val.value = newValue

    // transition 改太快？浏览器没反应过来..
    setTimeout(() => {
      transition.value = false
      val.value = (props.value % 10) + 10
    }, duration.value + 50)
  },
)
</script>

<style scoped>
.number-wrap {
  display: inline-flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.number-item {
  display: inline-block;
  height: 100%;
}
</style>
`
