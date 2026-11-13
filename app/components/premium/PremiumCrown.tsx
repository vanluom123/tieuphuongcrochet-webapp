import { CrownFilled } from '@ant-design/icons'
import '../../ui/components/premiumCrown.scss'

type PremiumCrownSize = 'sm' | 'lg'

interface PremiumCrownProps {
  readonly size?: PremiumCrownSize
}

const CROWN_SIZE_CLASS: Record<PremiumCrownSize, string> = {
  sm: 'premium-crown--sm',
  lg: 'premium-crown--lg',
}

const PremiumCrown = ({ size = 'sm' }: PremiumCrownProps) => (
  <span className={`premium-crown ${CROWN_SIZE_CLASS[size]}`} aria-hidden="true">
    <CrownFilled />
  </span>
)

export default PremiumCrown
