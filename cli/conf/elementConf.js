:root {

  /* Transition
  -------------------------- */
  --all-transition: all .3s cubic-bezier(.645,.045,.355,1);
  --fade-transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  --fade-linear-transition: opacity 200ms linear;
  --md-fade-transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms, opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
  --border-transition-base: border-color .2s cubic-bezier(.645,.045,.355,1);
  --color-transition-base: color .2s cubic-bezier(.645,.045,.355,1);

  /* Colors
  -------------------------- */
  --color-primary: #009688;
  --color-success: #4CAF50;
  --color-warning: #FF9800;
  --color-danger: #E91E63;
  --color-info: #00BCD4;
  --color-blue: #2196F3;
  --color-blue-light: #03A9F4;
  --color-blue-lighter: rgba(var(--color-blue), 0.12);
  --color-white: #fff;
  --color-black: #000;
  --color-grey: #c0ccda;

  /* Link
  -------------------------- */
  --link-color: #475669;
  --link-hover-color: var(--color-primary);

  /* Border
  -------------------------- */
  --border-width-base: 1px;
  --border-style-base: solid;
  --border-color-base: var(--color-grey);
  --border-color-hover: #8492a6;
  --border-base: var(--border-width-base) var(--border-style-base) var(--border-color-base);
  --border-radius-base: 0px;
  --border-radius-small: 0px;
  --border-radius-circle: 100%;
  --shadow-base: 0 0 2px rgba(var(--color-black), 0.18), 0 0 1px var(--color-blue-light);

  /* Box-shadow
  -------------------------- */
  --box-shadow-base: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  --box-shadow-dark: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .12);

  /* Fill
  -------------------------- */
  --fill-base: var(--color-white);

  /* Font
  -------------------------- */
  --font-size-base: 14px;
  --font-color-base: #1f2d3d;
  --font-color-disabled-base: #bbb;

  /* Size
  -------------------------- */
  --size-base: 14px;

  /* z-index
  -------------------------- */
  --index-normal: 1;
  --index-top: 1000;
  --index-popper: 2000;

  /* Disable base
  -------------------------- */
  --disabled-fill-base: #EFF2F7;
  --disabled-color-base: #bbb;
  --disabled-border-base: #D3DCE6;

  /* Icon
  -------------------------- */
  --icon-color: #666;

  /* Checkbox
  -------------------------- */
  --checkbox-font-size: 14px;
  --checkbox-color: #1f2d3d;
  --checkbox-input-height: 18px;
  --checkbox-input-width: 18px;
  --checkbox-input-border-radius: var(--border-radius-base);
  --checkbox-input-fill: var(--color-white);
  --checkbox-input-border: var(--border-base);
  --checkbox-input-border-color: var(--border-color-base);
  --checkbox-icon-color: var(--color-white);

  --checkbox-disabled-input-border-color: var(--disabled-border-base);
  --checkbox-disabled-input-fill: var(--disabled-fill-base);
  --checkbox-disabled-icon-color: var(--disabled-fill-base);

  --checkbox-disabled-checked-input-fill: var(--disabled-border-base);
  --checkbox-disabled-checked-input-border-color: var(--disabled-border-base);
  --checkbox-disabled-checked-icon-color: var(--color-white);

  --checkbox-checked-input-border-color: var(--color-blue);
  --checkbox-checked-input-fill: var(--color-primary);
  --checkbox-checked-icon-color: var(--fill-base);

  --checkbox-input-shadow-hover: var(--shadow-base);
  --checkbox-input-border-color-hover: var(--color-primary);

  /* Radio
  -------------------------- */
  --radio-font-size: 14px;
  --radio-color: #1f2d3d;
  --radio-input-height: 18px;
  --radio-input-width: 18px;
  --radio-input-border-radius: var(--border-radius-circle);
  --radio-input-fill: var(--color-white);
  --radio-input-border: var(--border-base);
  --radio-input-border-color: var(--border-color-base);
  --radio-icon-color: var(--color-white);

  --radio-disabled-input-border-color: var(--disabled-border-base);
  --radio-disabled-input-fill: var(--disabled-fill-base);
  --radio-disabled-icon-color: var(--disabled-fill-base);

  --radio-disabled-checked-input-fill: var(--disabled-border-base);
  --radio-disabled-checked-input-border-color: var(--disabled-border-base);
  --radio-disabled-checked-icon-color: var(--color-white);

  --radio-checked-input-border-color: var(--color-primary);
  --radio-checked-input-fill: var(--color-white);
  --radio-checked-icon-color: var(--color-primary);

  --radio-input-shadow-hover: var(--shadow-base);
  --radio-input-border-color-hover: var(--color-primary);

  --radio-button-font-size: var(--font-size-base);

  /* Select
  -------------------------- */
  --select-border-color-hover: var(--border-color-hover);
  --select-disabled-border: var(--disabled-border-base);
  --select-font-size: var(--font-size-base);
  --select-close-hover-color: #99a9bf;

  --select-input-color: var(--color-grey);
  --select-multiple-input-color: #666;
  --select-input-focus-background: var(--color-primary);
  --select-input-font-size: 12px;

  --select-tag-height: 24px;
  --select-tag-color: var(--color-white);
  --select-tag-background: var(--color-primary);

  --select-option-color: var(--link-color);
  --select-option-disabled-color: var(--color-grey);
  --select-option-height: 36px;
  --select-option-hover-background: #e5e9f2;
  --select-option-selected: var(--color-primary);
  --select-option-selected-hover: #1D8CE0;

  --select-group-color: #999;
  --select-group-height: 30px;
  --select-group-font-size: 12px;

  --select-dropdown-background: var(--color-white);
  --select-dropdown-shadow: var(--box-shadow-base);
  --select-dropdown-empty-color: #999;
  --select-dropdown-max-height: 274px;
  --select-dropdown-padding: 6px 0;
  --select-dropdown-empty-padding: 10px 0;
  --select-dropdown-border: solid 1px var(--disabled-border-base);

  /* Alert
  -------------------------- */
  --alert-padding: 8px 16px;
  --alert-border-radius: var(--border-radius-base);
  --alert-title-font-size: 13px;
  --alert-description-font-size: 12px;
  --alert-close-font-size: 12px;
  --alert-close-customed-font-size: 13px;

  --alert-success-color: var(--color-success);
  --alert-info-color: var(--color-info);
  --alert-warning-color: var(--color-warning);
  --alert-danger-color: var(--color-danger);

  --alert-icon-size: 16px;
  --alert-icon-large-size: 28px;

  /* Message Box
  -------------------------- */
  --msgbox-width: 420px;
  --msgbox-border-radius: 3px;
  --msgbox-font-size: 16px;
  --msgbox-content-font-size: 14px;
  --msgbox-content-color: var(--link-color);
  --msgbox-error-font-size: 12px;

  --msgbox-success-color: var(--color-success);
  --msgbox-info-color: var(--color-info);
  --msgbox-warning-color: var(--color-warning);
  --msgbox-danger-color: var(--color-danger);

  /* Message
  -------------------------- */
  --message-shadow: var(--box-shadow-base);
  --message-min-width: 300px;
  --message-padding: 10px 12px;
  --message-content-color: var(--border-color-hover);
  --message-close-color: var(--color-grey);
  --message-close-hover-color: #99A9BF;

  --message-success-color: var(--color-success);
  --message-info-color: var(--color-info);
  --message-warning-color: var(--color-warning);
  --message-danger-color: var(--color-danger);

  /* Message alert修复不可选择
  -------------------------- */
  --message-box-user-select: initial;
  --message-box-webkit-user-select: initial;

  /* Notification
  -------------------------- */
  --notification-width: 330px;
  --notification-padding: 20px;
  --notification-shadow: var(--box-shadow-base);
  --notification-icon-size: 40px;
  --notification-font-size: 12px;
//  --notification-font-size: var(--font-size-base);
  --notification-color: var(--border-color-hover);
  --notification-title-font-size: 14px;
  --notification-title-color: #1f2d3d;

  --notification-close-color: var(--color-grey);
  --notification-close-hover-color: #99A9BF;

  --notification-success-color: var(--color-success);
  --notification-info-color: var(--color-info);
  --notification-warning-color: var(--color-warning);
  --notification-danger-color: var(--color-danger);

  /* Input
  -------------------------- */
  --input-font-size: var(--font-size-base);
  --input-color: var(--font-color-base);
  --input-width: 140px;
  --input-height: 36px;
  --input-shadow-hover: var(--shadow-base);
  --input-border: var(--border-base);
  --input-border-color: var(--border-color-base);
  --input-border-radius: var(--border-radius-base);
  --input-border-color-hover: var(--border-color-hover);
  --input-fill: var(--color-white);
  --input-fill-disabled: var(--disabled-fill-base);
  --input-color-disabled: var(--font-color-disabled-base);
  --input-icon-color: var(--color-grey);
  --input-placeholder-color: #99a9bf;
  --input-max-width: 314px;

  --input-hover-border: var(--border-color-hover);

  --input-focus-border: var(--color-primary);
  --input-focus-fill: var(--color-white);

  --input-disabled-fill: var(--disabled-fill-base);
  --input-disabled-border: var(--disabled-border-base);
  --input-disabled-color: var(--disabled-color-base);
  --input-disabled-placeholder-color: var(--color-grey);

  --input-large-font-size: 16px;
  --input-large-height: 42px;

  --input-small-font-size: 13px;
  --input-small-height: 30px;

  --input-mini-font-size: 12px;
  --input-mini-height: 22px;

  /* Cascader
  -------------------------- */
  --cascader-menu-fill: var(--fill-base);
  --cascader-menu-font-size: var(--font-size-base);
  --cascader-menu-radius: var(--border-radius-base);
  --cascader-menu-border: var(--border-base);
  --cascader-menu-border-color: var(--border-color-base);
  --cascader-menu-border-width: var(--border-width-base);
  --cascader-menu-color: var(--font-color-base);
  --cascader-menu-option-color-active: var(--color-blue);
  --cascader-menu-option-fill-active: rgba(var(--color-blue), 0.12);
  --cascader-menu-option-color-hover: var(--font-color-base);
  --cascader-menu-option-fill-hover: rgba(var(--color-black), 0.06);
  --cascader-menu-option-color-disabled: #999;
  --cascader-menu-option-fill-disabled: rgba(var(--color-black), 0.06);
  --cascader-menu-option-empty-color: #666;
  --cascader-menu-group-color: #999;
  --cascader-menu-shadow: 0 1px 2px rgba(var(--color-black), 0.14), 0 0 3px rgba(var(--color-black), 0.14);
  --cascader-menu-option-pinyin-color: #999;
  --cascader-menu-submenu-shadow: 1px 1px 2px rgba(var(--color-black), 0.14), 1px 0 2px rgba(var(--color-black), 0.14);

  /* Group
  -------------------------- */
  --group-option-flex: 0 0 (1/5) * 100%;
  --group-option-offset-bottom: 12px;
  --group-option-fill-hover: rgba(var(--color-black), 0.06);
  --group-title-color: var(--color-black);
  --group-title-font-size: var(--font-size-base);
  --group-title-width: 66px;

  /* Tab
  -------------------------- */
  --tab-font-size: var(--font-size-base);
  --tab-border-line: 1px solid #e4e4e4;
  --tab-header-color-active: var(--color-blue);
  --tab-header-color-hover: var(--font-color-base);
  --tab-header-color: var(--font-color-base);
  --tab-header-fill-active: rgba(var(--color-black), 0.06);
  --tab-header-fill-hover: rgba(var(--color-black), 0.06);
  --tab-vertical-header-width: 90px;
  --tab-vertical-header-count-color: var(--color-white);
  --tab-vertical-header-count-fill: var(--color-blue);
  --tab-horizontal-border: 2px solid #438de0;

  /* Button
  -------------------------- */
  --button-font-size: 14px;
  --button-border-radius: var(--border-radius-base);
  --button-paddding: 5px 20px;
  --button-padding-vertical: 10px;
  --button-padding-horizontal: 15px;

  --button-large-font-size: 16px;
  --button-large-padding-vertical: 11px;
  --button-large-padding-horizontal: 19px;

  --button-small-font-size: 12px;
  --button-small-padding-vertical: 7px;
  --button-small-padding-horizontal: 9px;

  --button-mini-font-size: 12px;
  --button-mini-padding-vertical: 4px;
  --button-mini-padding-horizontal: 4px;

  --button-default-color: #1F2D3D;
  --button-default-fill: var(--color-white);
  --button-default-border: #c4c4c4;

  --button-ghost-color: #666;
  --button-ghost-fill: transparent;
  --button-ghost-border: none;

  --button-disabled-color: var(--color-grey);
  --button-disabled-fill: #EFF2F7;
  --button-disabled-border: var(--disabled-border-base);

  --button-primary-border: var(--color-primary);
  --button-primary-color: var(--color-white);
  --button-primary-fill: var(--color-primary);

  --button-success-border: var(--color-success);
  --button-success-color: var(--color-white);
  --button-success-fill: var(--color-success);

  --button-warning-border: var(--color-warning);
  --button-warning-color: var(--color-white);
  --button-warning-fill: var(--color-warning);

  --button-danger-border: var(--color-danger);
  --button-danger-color: var(--color-white);
  --button-danger-fill: var(--color-danger);

  --button-info-border: var(--color-info);
  --button-info-color: var(--color-white);
  --button-info-fill: var(--color-info);

  --button-hover-tint-percent: 20%;
  --button-active-shade-percent: 10%;


  /* cascader
  -------------------------- */
  --cascader-height: 200px;

  /* Switch
 -------------------------- */
  --switch-on-color: var(--color-primary);
  --switch-off-color: var(--color-grey);
  --switch-disabled-color: #E5E9F3;
  --switch-disabled-text-color: #F9FAFC;

  --switch-font-size: var(--font-size-base);
  --switch-core-border-radius: 12px;
  --switch-width: 46px;
  --switch-height: 22px;
  --switch-button-size: 16px;

  /* Dialog
 -------------------------- */
  --dialog-background-color: var(--color-blue);
  --dialog-footer-background: var(--color-blue-lighter);
  --dialog-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  --dialog-tiny-width: 30%;
  --dialog-small-width: 50%;
  --dialog-large-width: 90%;
  --dialog-close-color: var(--color-grey);
  --dialog-close-hover-color: var(--color-primary);
  --dialog-title-font-size: 16px;
  --dialog-font-size: 14px;

  /* Table
 -------------------------- */
  --table-border-color: #e0e6ed;
  --table-text-color: #1f2d3d;
  --table-header-background: #EFF2F7;

  /* Pagination
 -------------------------- */
  --pagination-font-size: 13px;
  --pagination-fill: var(--color-white);
  --pagination-color: var(--link-color);
  --pagination-border-radius: 2px;
  --pagination-button-color: #99a9bf;
  --pagination-button-size: 28px;
  --pagination-button-disabled-color: #e4e4e4;
  --pagination-button-disabled-fill: var(--color-white);
  --pagination-border-color: var(--disabled-border-base);
  --pagination-hover-fill: var(--color-primary);
  --pagination-hover-color: var(--color-white);

  /* Popover
 -------------------------- */
  --popover-fill: var(--color-white);
  --popover-font-size: 12px;
  --popover-border-color: var(--disabled-border-base);
  --popover-arrow-size: 6px;
  --popover-padding: 10px;
  --popover-title-font-size: 13px;
  --popover-title-color: #1f2d3d;

  /* Tooltip
  -------------------------- */
  --tooltip-fill: #1f2d3d;
  --tooltip-color: var(--color-white);
  --tooltip-font-size: 12px;
  --tooltip-border-color: #1f2d3d;
  --tooltip-arrow-size: 6px;
  --tooltip-padding: 10px;

  /* Tag
  -------------------------- */
  --tag-padding: 0 5px;
  --tag-fill: var(--border-color-hover);
  --tag-color: var(--color-white);
  --tag-close-color: #666;
  --tag-font-size: 12px;
  --tag-border-radius: 4px;

  --tag-gray-fill: #e5e9f2;
  --tag-gray-border: #e5e9f2;
  --tag-gray-color: var(--link-color);

  --tag-primary-fill: rgba(32,159,255,0.10);
  --tag-primary-border: rgba(32,159,255,0.20);
  --tag-primary-color: var(--color-primary);

  --tag-success-fill: rgba(18,206,102,0.10);
  --tag-success-border: rgba(18,206,102,0.20);
  --tag-success-color: var(--color-success);

  --tag-warning-fill: rgba(247,186,41,0.10);
  --tag-warning-border: rgba(247,186,41,0.20);
  --tag-warning-color: var(--color-warning);

  --tag-danger-fill: rgba(255,73,73,0.10);
  --tag-danger-border: rgba(255,73,73,0.20);
  --tag-danger-color: var(--color-danger);

  /* Dropdown
  -------------------------- */
  --dropdown-menu-box-shadow: var(--box-shadow-dark);
  --dropdown-menuItem-hover-fill: #e5e9f2;
  --dropdown-menuItem-hover-color: var(--link-color);

  /* Badge
  -------------------------- */
  --badge-fill: var(--color-danger);
  --badge-radius: 10px;
  --badge-font-size: 12px;
  --badge-padding: 6px;
  --badge-size: 18px;

  /* Card
  --------------------------*/
  --card-border-color: var(--disabled-border-base);
  --card-border-radius: 4px;
  --card-padding: 20px;

  /* Slider
  --------------------------*/
  --slider-main-background-color: var(--color-primary);
  --slider-runway-background-color: #e5e9f2;
  --slider-button-hover-color: #1d8ce0;
  --slider-stop-background-color: var(--color-grey);
  --slider-disable-color: var(--color-grey);

  --slider-margin: 16px 0;
  --slider-border-radius: 3px;
  --slider-height: 4px;
  --slider-button-size: 12px;
  --slider-button-wrapper-size: 36px;
  --slider-button-wrapper-offset: -16px;

  /* Steps
  --------------------------*/
  --steps-border-color: var(--disabled-border-base);
  --steps-border-radius: 4px;
  --steps-padding: 20px;

  /* Steps
  --------------------------*/
  --menu-item-color: var(--link-color);
  --menu-item-fill: #eff2f7;
  --menu-item-hover-fill: var(--disabled-border-base);
  --submenu-item-fill: #e5e9f2;

  --dark-menu-item-color: var(--link-color);
  --dark-menu-item-fill: #324057;
  --dark-menu-item-hover-fill: var(--link-color);
  --dark-submenu-item-fill: #1f2d3d;

  /* Rate
  --------------------------*/
  --rate-height: 20px;
  --rate-font-size: var(--font-size-base);
  --rate-icon-size: 18px;
  --rate-icon-margin: 6px;
  --rate-icon-color: #C6D1DE;

  /* DatePicker
  --------------------------*/
  --datepicker-color: var(--link-color);
  --datepicker-off-color: #ddd;
  --datepicker-header-color: var(--border-color-hover);
  --datepicker-icon-color: #99a9bf;
  --datepicker-border-color: var(--disabled-border-base);
  --datepicker-inner-border-color: #e4e4e4;
  --datepicker-cell-hover-color: #e5e9f2;
  --datepicker-inrange-color: #D3ECFF;
  --datepicker-inrange-hover-color: #AFDCFF;
  --datepicker-active-color: var(--color-primary);
  --datepicker-text-hover-color: var(--color-primary);

  /* Loading
  --------------------------*/
  --loading-spinner-size: 42px;
  --loading-fullscreen-spinner-size: 50px;
}
