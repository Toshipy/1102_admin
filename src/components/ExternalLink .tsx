import { FC } from 'react'
import LaunchIcon from '@material-ui/icons/Launch'
import { Link as MuiLink } from '@material-ui/core'

type Props = {
  url: string
  title: string
}

export const ExternalLink: FC<Props> = ({ url, title }: Props) => {
  return (
    <MuiLink
      href={url} target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {title}
      <LaunchIcon fontSize="inherit" />
    </MuiLink>
  )
}
