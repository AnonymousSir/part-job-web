import {
  ElContainer, ElMain, ElAside, ElMenu, ElMenuItem, ElSubMenu, ElHeader, ElBreadcrumb, ElBreadcrumbItem, ElForm, ElFormItem, ElInput,
  ElButton, ElMessage, ElSelect, ElOptionGroup, ElOption, ElCheckbox, ElDatePicker, ElSelectV2, ElTable, ElTableColumn,
  ElMessageBox, ElSlider, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElPagination, ElTag, ElDialog, ElTabs, ElTabPane, ElUpload,
  ElRadioGroup, ElRadio, ElRow, ElCol, ElImage
} from 'element-plus'

const elements = [
  ElContainer, ElMain, ElAside, ElMenu, ElMenuItem, ElSubMenu, ElHeader, ElBreadcrumb, ElBreadcrumbItem, ElForm, ElFormItem, ElInput,
  ElButton, ElMessage, ElSelect, ElOptionGroup, ElOption, ElCheckbox, ElDatePicker, ElSelectV2, ElTable, ElTableColumn,
  ElMessageBox, ElSlider, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElPagination, ElTag, ElDialog, ElTabs, ElTabPane, ElUpload,
  ElRadioGroup, ElRadio, ElRow, ElCol, ElImage
]

function useElementImport(app) {
  elements.forEach(elment => {
    app.component(elment.name, elment)
  })
}

export default useElementImport