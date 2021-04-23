<template lang="pug">
component(
  ref="formEl"
  :is="formRegister ? 'w-form-element' : 'div'"
  v-bind="formRegister && { validators, inputValue, disabled: isDisabled, readonly: isReadonly, isFocused }"
  :valid.sync="valid"
  @reset="$emit('update:modelValue', inputValue = '');$emit('input', '')"
  :class="classes")
  input(v-if="type === 'hidden'" type="hidden" :name="name || null" v-model="inputValue")
  template(v-else)
    //- Left label.
    template(v-if="labelPosition === 'left'")
      label.w-input__label.w-input__label--left.w-form-el-shakable(v-if="$slots.default" :for="`rfx-input--${_uid}`")
        slot
      label.w-input__label.w-input__label--left.w-form-el-shakable(v-else-if="label" :for="`rfx-input--${_uid}`" v-html="label")

    //- Input wrapper.
    .w-input__input-wrap(:class="inputWrapClasses")
      //- w-icon.w-input__icon.w-input__icon--inner-left(
      //-   v-if="innerIconLeft"
      //-   tag="label"
      //-   :for="`rfx-input--${_uid}`"
      //-   @click="$emit('click:inner-icon-left', $event)") {{ innerIconLeft }}
      input.w-input__input(
        v-model="inputValue"
        v-on="listeners"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        :id="`rfx-input--${_uid}`"
        :type="type"
        :name="inputName"
        :placeholder="placeholder || null"
        :step="step || null"
        :min="min || null"
        :max="max || null"
        :minlength="minlength || null"
        :maxlength="maxlength || null"
        :readonly="isReadonly || null"
        :aria-readonly="isReadonly ? 'true' : 'false'"
        :autocomplete="autocomplete"
        :disabled="isDisabled || null"
        :required="required || null"
        v-bind="$attrs")
      template(v-if="labelPosition === 'inside' && showLabelInside")
        label.w-input__label.w-input__label--inside.w-form-el-shakable(
          v-if="$slots.default"
          :for="`rfx-input--${_uid}`"
          :class="isFocused && { [valid === false ? 'error' : color]: color || valid === false }")
          slot
        label.w-input__label.w-input__label--inside.w-form-el-shakable(
          v-else-if="label"
          :for="`rfx-input--${_uid}`"
          v-html="label"
          :class="isFocused && { [valid === false ? 'error' : color]: color || valid === false }")
      //- w-icon.w-input__icon.w-input__icon--inner-right(
      //-   v-if="innerIconRight"
      //-   tag="label"
      //-   :for="`rfx-input--${_uid}`"
      //-   @click="$emit('click:inner-icon-right', $event)") {{ innerIconRight }}

    //- Right label.
    template(v-if="labelPosition === 'right'")
      label.w-input__label.w-input__label--right.w-form-el-shakable(v-if="$slots.default" :for="`rfx-input--${_uid}`")
        slot
      label.w-input__label.w-input__label--right.w-form-el-shakable(v-else-if="label" :for="`rfx-input--${_uid}`" v-html="label")
</template>

<script>
import FormElementMixin from '@/mixins/form-elements'
export default {
  name: 'rfx-input',
  mixins: [FormElementMixin],
  props: {
    value: { default: '' },
    /**
     * Allows for other types of native HTML inputs
     * date, email, file, password, search, tel, text, time, url
     */
    type: { type: String, default: 'text' },
    /**
     * An optional label which will move above the input on :focus or value
     */
    label: { type: String },
    /**
     * Placeholder which will be overridden by the input value
     */
    placeholder: { type: String },
    /**
     * Adds a line underneath the input
     */
    underline: { type: Boolean, default: true },
    /**
     * Rounded style
     */
    round: { type: Boolean },
    /**
     * Enable autocomplete? (native browser)
     */
    autocomplete: {
      type: String,
      default: 'off',
      validator: function (value) {
        // The value must match one of these strings
        return ['on', 'off'].includes(value)
      },
    },

    labelPosition: { type: String, default: 'inside' },
    innerIconLeft: { type: String },
    innerIconRight: { type: String },
    /**
     * When label is inside, allows to move the label above on focus or when filled.
     */
    staticLabel: { type: Boolean },
    color: { type: String, default: 'primary' },
    bgColor: { type: String },
    minlength: { type: [Number, String] },
    maxlength: { type: [Number, String] },
    step: { type: [Number, String] },
    min: { type: [Number, String] },
    max: { type: [Number, String] },
    dark: { type: Boolean },
    shadow: { type: Boolean },

    // Props from mixin: name, disabled, readonly, required, validators.
    // Computed from mixin: inputName, isDisabled & isReadonly.
  },
  emits: [
    'input',
    'update:modelValue',
    'focus',
    'blur',
    'click:inner-icon-left',
    'click:inner-icon-right',
  ],
  data() {
    return {
      inputValue: this.value,
      // In case of incorrect input type="number", the inputValue gets emptied,
      // and the label would come back on top of the input text.
      inputNumberError: false,
      isFocused: false,
    }
  },
  computed: {
    listeners() {
      // Remove the events that are fired separately, so they don't fire twice.
      // eslint-disable-next-line no-unused-vars
      const { input, focus, blur, ...listeners } = this.$attrs
      return listeners
    },
    hasValue() {
      return (
        this.inputValue ||
        ['date', 'time'].includes(this.type) ||
        (this.type === 'number' && this.inputNumberError)
      )
    },
    hasLabel() {
      return this.label || this.$slots.default
    },
    showLabelInside() {
      return !this.staticLabel || (!this.hasValue && !this.placeholder)
    },
    classes() {
      return {
        'w-input': true,
        'rfx-input--disabled': this.isDisabled,
        'rfx-input--readonly': this.isReadonly,
        [`rfx-input--${this.hasValue ? 'filled' : 'empty'}`]: true,
        'rfx-input--focused': this.isFocused,
        'rfx-input--dark': this.dark,
        'rfx-input--floating-label':
          this.hasLabel && this.labelPosition === 'inside' && !this.staticLabel,
        'rfx-input--no-padding':
          !this.underline && !this.bgColor && !this.shadow && !this.round,
        'rfx-input--has-placeholder': this.placeholder,
        'rfx-input--inner-icon-left': this.innerIconLeft,
        'rfx-input--inner-icon-right': this.innerIconRight,
      }
    },
    inputWrapClasses() {
      return {
        [this.valid === false ? 'error' : this.color]:
          this.color || this.valid === false,
        // [`${this.bgColor}--bg`]: this.bgColor,
        'w-input__input-wrap--round': this.round,
        // Box adds a padding on input. If there is a bgColor or shadow, a padding is needed.
        'w-input__input-wrap--box':
          this.underline || this.bgColor || this.shadow,
        'w-input__input-wrap--underline': this.underline,
        'w-input__input-wrap--shadow': this.shadow,
        'w-input__input-wrap--no-padding':
          !this.underline && !this.bgColor && !this.shadow && !this.round,
      }
    },
  },
  methods: {
    onInput(e) {
      this.inputNumberError = e.target.validity.badInput // For input type number.
      this.$emit('update:modelValue', this.inputValue)
      this.$emit('input', this.inputValue)
    },
    onFocus(e) {
      this.isFocused = true
      this.$emit('focus', e)
    },
    onBlur(e) {
      this.isFocused = false
      this.$emit('blur', e)
    },
  },
  watch: {
    value(value) {
      this.inputValue = value
    },
  },
}
</script>

<style lang="scss" scoped>
$inactive-color: #777;
.w-input {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  align-items: center;
  // font-size: $base-font-size;
  // Input field wrapper.
  // ------------------------------------------------------
  &__input-wrap {
    position: relative;
    display: inline-flex;
    flex: 1 1 auto;
    align-items: center;
    // height: $form-field-height;
    // border-radius: $border-radius;
    // border: $border;
    // transition: border $transition-duration;
    .rfx-input--floating-label & {
      // margin-top: 3 * $base-increment;
    }
    .w-input[class^='bdrs'] &,
    .w-input[class*=' bdrs'] & {
      border-radius: inherit;
    }
    &--underline {
      border-bottom-left-radius: initial;
      border-bottom-right-radius: initial;
      border-width: 0 0 1px;
    }
    &--round {
      border-radius: 9em;
    }

    &--shadow {
      // box-shadow: $box-shadow;
    }
    .rfx-input--focused & {
      border-color: currentColor;
    }
    // Underline.
    &--underline:after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 0;
      border-bottom: 2px solid currentColor;
      // transition: $transition-duration;
      transform: scaleX(0);
      pointer-events: none;
    }
    .rfx-input--focused &--underline:after {
      transform: scaleX(1);
    }
    &--round.w-input__input-wrap--underline:after {
      border-radius: 9em;
      // transition: $transition-duration, height 0.035s;
    }
    .rfx-input--focused &--round.w-input__input-wrap--underline:after {
      height: 100%;
      // transition: $transition-duration,
      // height 0s ($transition-duration - 0.035s);
    }
  }
  // Input field.
  // ------------------------------------------------------
  &__input {
    width: 100%;
    height: 100%;
    font-size: inherit;
    color: inherit;
    text-align: inherit;
    background: none;
    border: none;
    outline: none;
    // padding-left: 2 * $base-increment;
    // padding-right: 2 * $base-increment;
    // For type="search" on Safari.
    -webkit-appearance: none;
    &::-webkit-search-decoration {
      -webkit-appearance: none;
    }
  }
  &--no-padding &__input {
    padding-left: 0;
    padding-right: 0;
  }
  &__input-wrap--round &__input {
    // padding-left: 3 * $base-increment;
    // padding-right: 3 * $base-increment;
  }
  &--inner-icon-left &__input {
    padding-left: 27px;
  }
  &--inner-icon-right &__input {
    padding-right: 27px;
  }
  &--disabled &__input {
    // color: $disabled-color;
    cursor: not-allowed;
    -webkit-tap-highlight-color: transparent;
  }
  &--disabled input::placeholder {
    color: inherit;
  }
  // Icons inside.
  // ------------------------------------------------------
  &__icon {
    position: absolute;
  }
  &__icon--inner-left {
    left: 6px;
  }
  &__icon--inner-right {
    right: 6px;
  }
  &--no-padding &__icon--inner-left {
    left: 1px;
  }
  &--no-padding &__icon--inner-right {
    right: 1px;
  }
  .rfx-input--focused &__icon {
    color: currentColor;
  }
  &--disabled &__icon {
    // color: $disabled-color;
    cursor: not-allowed;
    -webkit-tap-highlight-color: transparent;
  }
  // Label.
  // ------------------------------------------------------
  &__label {
    // transition: color $transition-duration;
    cursor: pointer;
    &--left {
      // margin-right: 2 * $base-increment;
    }
    &--right {
      // margin-left: 2 * $base-increment;
    }
    .rfx-input--disabled & {
      // color: $disabled-color;
      cursor: not-allowed;
      -webkit-tap-highlight-color: transparent;
    }
    .rfx-input--readonly.rfx-input--empty & {
      opacity: 0.5;
      cursor: auto;
    }
  }
  &__label--inside {
    position: absolute;
    top: 50%;
    left: 0;
    // padding-left: 2 * $base-increment;
    transform: translateY(-50%);
    pointer-events: none;
    .rfx-input--no-padding & {
      left: 0;
      padding-left: 0;
      padding-right: 0;
    }
    .w-input__input-wrap--round & {
      // padding-left: round(3 * $base-increment);
      // padding-right: round(3 * $base-increment);
    }
    .rfx-input--inner-icon-left & {
      left: 18px;
    }
    .rfx-input--no-padding.rfx-input--inner-icon-left & {
      left: 26px;
    }
    .rfx-input--floating-label & {
      transform-origin: 0 0;
      // transition: $transition-duration ease;
    }
    // move label with underline style.
    .rfx-input--focused.rfx-input--floating-label &,
    .rfx-input--filled.rfx-input--floating-label &,
    .rfx-input--has-placeholder.rfx-input--floating-label & {
      transform: translateY(-160%) scale(0.85);
    }
    // Chrome & Safari - Must remain in a separated rule as Firefox discard the whole rule seeing -webkit-.
    .rfx-input--floating-label .w-input__input:-webkit-autofill & {
      transform: translateY(-160%) scale(0.85);
    }
    // Move label with outline style or with shadow.
    .rfx-input--focused.rfx-input--floating-label .w-input__input-wrap--box &,
    .rfx-input--filled.rfx-input--floating-label .w-input__input-wrap--box &,
    .rfx-input--has-placeholder.rfx-input--floating-label
      .w-input__input-wrap--box
      & {
      transform: translateY(-180%) scale(0.85);
    }
    .rfx-input--focused.rfx-input--floating-label.rfx-input--inner-icon-left &,
    .rfx-input--filled.rfx-input--floating-label.rfx-input--inner-icon-left & {
      left: 0;
    }
    // Chrome & Safari - Must remain in a separated rule as Firefox discard the whole rule seeing -webkit-.
    .rfx-input--floating-label.rfx-input--inner-icon-left
      .w-input__input:-webkit-autofill
      & {
      left: 0;
    }
    .rfx-input--focused & {
      color: currentColor;
    }
  }
}
</style>
