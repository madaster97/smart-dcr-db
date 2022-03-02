import * as React from 'react'
import {
  Textarea,
  useClipboard,
  Button,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'

export const CopyText: React.FC<{value: string, height: number}> = ({height,value}) => {
  const { hasCopied, onCopy } = useClipboard(value)
  return (
    <InputGroup>
      <Textarea h={225} value={value} isReadOnly />
      <InputRightElement>
        <Button onClick={onCopy} ml={2}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}