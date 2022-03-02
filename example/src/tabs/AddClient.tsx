import * as React from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack
} from '@chakra-ui/react'
import { addClient } from 'smart-dcr-db'
import { useFresh } from '../hooks/useFresh'

const SubmitResult: React.FC<{ iss: string; client_id: string }> = ({
  client_id,
  iss
}) => {
  const [submitStatus] = useFresh(() => addClient(client_id, iss))
  switch (submitStatus.status) {
    case 'complete':
      const { client_id, iss } = submitStatus.data
      return (
        <Box>
          Successfully saved client {client_id} for iss
          {iss}
        </Box>
      )
    case 'error':
      const { error } = submitStatus
      return <Box>Error: {error.message || JSON.stringify(error)}</Box>
    case 'loading':
      return <Box>Waiting on submission response...</Box>
  }
}

export const AddClient: React.FC<{}> = () => {
  const [clientId, setClientId] = React.useState<string>('')
  const [iss, setIss] = React.useState<string>(
    'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4'
  )
  const [submit, setSubmit] = React.useState<boolean>(false)

  React.useEffect(() => {
    setSubmit(false)
  }, [clientId, iss])

  return (
    <VStack>
      <form
        onSubmit={ev => {
          ev.preventDefault()
          setSubmit(true)
        }}
      >
        <FormControl isRequired>
          <FormLabel htmlFor='dynamic-client'>Dynamic Client ID</FormLabel>
          <Input
            value={clientId}
            onChange={ev => {setClientId(ev.target.value)}}
            id='dynamic-client'
            placeholder='Your dynamic client ID'
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor='iss'>FHIR Issuer</FormLabel>
          <Input
            value={iss}
            onChange={ev => {setIss(ev.target.value)}}
            id='iss'
            placeholder='Your FHIR server iss'
          />
        </FormControl>
        <Button type='submit' isDisabled={!!submit}>Store client</Button>
      </form>
      {submit && <SubmitResult {...{client_id: clientId, iss}} />}
    </VStack>
  )
}