import * as React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useBreakpointValue,
  IconButton
} from '@chakra-ui/react'
import { DeleteIcon } from "@chakra-ui/icons"
import { ClientData } from 'smart-dcr-db'

export type ClientSelector = (data: ClientData) => void
export const ClientTable: React.FC<{
  data: ClientData[]
  includeIss: boolean
  selectClient: ClientSelector,
  deleteClient: ClientSelector
}> = ({ data, includeIss, selectClient, deleteClient }) => {
  const showAllDetails = useBreakpointValue({base: false, sm: true})
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Client ID</Th>
          {showAllDetails
            ? <>
            {includeIss && <Th>Issuer</Th>}
            <Th>Creation Date</Th>
          </> : <></>
          }
        </Tr>
      </Thead>
      <Tbody>
        {data.map(row => {
          return (
            <Tr key={row.client_id + '.' + row.iss}>
              <Td>
                <Button onClick={() => selectClient(row)}>
                  {row.client_id}
                </Button>
                <IconButton onClick={() => deleteClient(row)} aria-label='Delete client' icon={<DeleteIcon />} />
              </Td>
              {showAllDetails ? (
                <>
                {includeIss && <Td>{row.iss}</Td>}
                  <Td>{row.creationTime.toDateString()}</Td>
                </>
              ) : <></>}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
