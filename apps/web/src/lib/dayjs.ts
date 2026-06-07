import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime.js'

dayjs.locale('pt-br')
dayjs.extend(relativeTime)

export { dayjs }
