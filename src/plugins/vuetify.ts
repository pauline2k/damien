import './main.scss'
import '@mdi/font/css/materialdesignicons.css'
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg'
import {createVuetify} from 'vuetify'
import {VAppBar} from 'vuetify/components/VAppBar'
import {VApp} from 'vuetify/components/VApp'
import {VAutocomplete} from 'vuetify/components/VAutocomplete'
import {VBanner} from 'vuetify/components/VBanner'
import {VBtn} from 'vuetify/components/VBtn'
import {VBtnToggle} from 'vuetify/components/VBtnToggle'
import {VCard, VCardActions, VCardSubtitle, VCardText, VCardTitle} from 'vuetify/components/VCard'
import {VCheckbox} from 'vuetify/components/VCheckbox'
import {VChip} from 'vuetify/components/VChip'
import {VCol, VContainer, VSpacer, VRow} from 'vuetify/components/VGrid'
import {VCombobox} from 'vuetify/components/VCombobox'
import {VDataTable, VDataTableVirtual} from 'vuetify/components/VDataTable'
import {VDialog} from 'vuetify/components/VDialog'
import {VDivider} from 'vuetify/components/VDivider'
import {VExpansionPanel, VExpansionPanels} from 'vuetify/components/VExpansionPanel'
import {VFooter} from 'vuetify/components/VFooter'
import {VHover} from 'vuetify/components'
import {VIcon} from 'vuetify/components/VIcon'
import {VImg} from 'vuetify/components/VImg'
import {VLayout} from 'vuetify/components/VLayout'
import {VList, VListItem, VListItemAction, VListItemTitle} from 'vuetify/components/VList'
import {VMain} from 'vuetify/components/VMain'
import {VMenu} from 'vuetify/components/VMenu'
import {VNavigationDrawer} from 'vuetify/components/VNavigationDrawer'
import {VOverlay} from 'vuetify/components/VOverlay'
import {VProgressCircular} from 'vuetify/components/VProgressCircular'
import {VRadio} from 'vuetify/components/VRadio'
import {VRadioGroup} from 'vuetify/components/VRadioGroup'
import {VTable} from 'vuetify/components/VTable'
import {VTextarea} from 'vuetify/components/VTextarea'
import {VTextField} from 'vuetify/components/VTextField'
import {VSlideXReverseTransition, VSnackbar, VSwitch, VToolbar} from 'vuetify/components'

export default createVuetify({
  components: {
    VApp,
    VAppBar,
    VAutocomplete,
    VBanner,
    VBtn,
    VBtnToggle,
    VCard,
    VCardActions,
    VCardSubtitle,
    VCardText,
    VCardTitle,
    VCheckbox,
    VChip,
    VCol,
    VCombobox,
    VContainer,
    VDataTable,
    VDataTableVirtual,
    VDialog,
    VDivider,
    VExpansionPanel,
    VExpansionPanels,
    VFooter,
    VHover,
    VIcon,
    VImg,
    VLayout,
    VList,
    VListItem,
    VListItemAction,
    VListItemTitle,
    VMain,
    VMenu,
    VNavigationDrawer,
    VOverlay,
    VProgressCircular,
    VRadio,
    VRadioGroup,
    VRow,
    VSlideXReverseTransition,
    VSnackbar,
    VSpacer,
    VSwitch,
    VTable,
    VTextarea,
    VTextField,
    VToolbar
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;',
    },
    VTextField: {
      density: 'compact',
      variant: 'outlined'
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    themes: {
      light: {
        colors: {
          accent: '#CC4000',
          anchor: '#CC4000',
          background: '#FFF',
          disabled: '#BBCAD4',
          error: '#B71C1C',
          'evaluation-row-confirmed': '#EBF8FF',
          'evaluation-row-ignore': '#EBEBEB',
          'evaluation-row-review': '#F2FFF6',
          'evaluation-row-xlisting': '#FFFFDD',
          hovered: '#EEE',
          inactive: '#EEE',
          'inactive-contrast': '#666',
          muted: '#606060',
          primary: '#125074',
          'primary-contrast': '#DAF0FD',
          secondary: '#307AAB',
          success: '#00C853',
          tertiary: '#307AAB',
          title: '#125074'
        }
      },
      dark: {
        colors: {
          accent: '#F04A00',
          anchor: '#F04A00',
          background: '#0D202C',
          disabled: '#BBCAD4',
          error: '#9A0007',
          'evaluation-row-confirmed': '#082231',
          'evaluation-row-ignore': '#2D2D2D',
          'evaluation-row-review': '#0E1F0E',
          'evaluation-row-xlisting': '#2D2800',
          hovered: '#616161',
          inactive: '#AAA',
          'inactive-contrast': '#333',
          muted: '#BDBDBD',
          primary: '#0C354D',
          'primary-contrast': '#94A8B3',
          secondary: '#1C4F72',
          success: '#00953E',
          tertiary: '#80BAE0',
          title: '#1E71A4'
        }
      }
    }
  }
})
