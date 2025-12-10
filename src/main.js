/**
 * Point d'entrée principal de l'application Vue.js.
 * 
 * Configure Vue, Pinia, Vue Router et FontAwesome.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  // Navigation & UI
  faHome, faBars, faTimes, faSearch, faChevronDown, faChevronRight, faChevronLeft,
  faPlus, faEdit, faTrash, faEye, faEyeSlash, faSave, faDownload, faUpload,
  faCheck, faCheckCircle, faTimesCircle, faExclamationCircle, faInfoCircle,
  
  // Users & People
  faUser, faUsers, faUserGraduate, faUserCircle, faUserSlash, faUserPlus, faUserTie,
  faUserShield, faUsersCog, faUserFriends,
  
  // Education
  faGraduationCap, faChalkboardTeacher, faChalkboard, faBook, faBookOpen,
  faSchool, faIdCard, faIdBadge,
  
  // Calendar & Time
  faCalendar, faCalendarAlt, faCalendarCheck, faCalendarPlus, faClock,
  
  // Documents & Files
  faFile, faFileAlt, faFolder, faFolderOpen, faLink, faExternalLinkAlt,
  faFileInvoiceDollar,
  
  // Actions & Status
  faLock, faKey, faSignOutAlt, faCog, faSlidersH, faSync,
  faArrowUp, faArrowDown,
  
  // Communication
  faEnvelope, faPhone, faBell, faComments, faBullhorn,
  
  // Charts & Reports
  faChartBar, faChartPie, faChartLine,
  
  // Finance
  faMoneyBill, faWallet, faCreditCard,
  
  // Assessment
  faClipboardList, faClipboardCheck,
  
  // Other
  faMapMarkerAlt, faMapMarkedAlt, faAddressBook,
  faSignature, faVenusMars, faCake,
  faInbox, faHistory, faPrint,
  faImage, faCloudUploadAlt,
  faServer, faDatabase, faShieldAlt,
  faDoorOpen, faUmbrellaBeach,
  faTh, faList,
  faExclamationTriangle,
  faPalette, faBriefcase
} from '@fortawesome/free-solid-svg-icons'

// Ajouter toutes les icônes à la bibliothèque
library.add(
  // Navigation & UI
  faHome, faBars, faTimes, faSearch, faChevronDown, faChevronRight, faChevronLeft,
  faPlus, faEdit, faTrash, faEye, faEyeSlash, faSave, faDownload, faUpload,
  faCheck, faCheckCircle, faTimesCircle, faExclamationCircle, faInfoCircle,
  
  // Users & People
  faUser, faUsers, faUserGraduate, faUserCircle, faUserSlash, faUserPlus, faUserTie,
  faUserShield, faUsersCog, faUserFriends,
  
  // Education
  faGraduationCap, faChalkboardTeacher, faChalkboard, faBook, faBookOpen,
  faSchool, faIdCard, faIdBadge,
  
  // Calendar & Time
  faCalendar, faCalendarAlt, faCalendarCheck, faCalendarPlus, faClock,
  
  // Documents & Files
  faFile, faFileAlt, faFolder, faFolderOpen, faLink, faExternalLinkAlt,
  faFileInvoiceDollar,
  
  // Actions & Status
  faLock, faKey, faSignOutAlt, faCog, faSlidersH, faSync,
  faArrowUp, faArrowDown,
  
  // Communication
  faEnvelope, faPhone, faBell, faComments, faBullhorn,
  
  // Charts & Reports
  faChartBar, faChartPie, faChartLine,
  
  // Finance
  faMoneyBill, faWallet, faCreditCard,
  
  // Assessment
  faClipboardList, faClipboardCheck,
  
  // Other
  faMapMarkerAlt, faMapMarkedAlt, faAddressBook,
  faSignature, faVenusMars, faCake,
  faInbox, faHistory, faPrint,
  faImage, faCloudUploadAlt,
  faServer, faDatabase, faShieldAlt,
  faDoorOpen, faUmbrellaBeach,
  faTh, faList,
  faExclamationTriangle,
  faPalette, faBriefcase
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
