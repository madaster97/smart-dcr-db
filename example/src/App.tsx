import {
  Box,
  Flex,
  Heading,
  Spacer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react'
import React from 'react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { AddClient } from './tabs/AddClient'

export const App: React.FC = () => {
  return (
    <Box>
      <Flex>
        <Box p='2'>
          <Heading size='md'>SMART Dynamic Client App</Heading>
        </Box>
        <Spacer />
        <Box>
          <ColorModeSwitcher />
        </Box>
      </Flex>
      {/* Things I need:
      1. Add a client
      2. Table view of all clients with deletes
      3. See a list of iss
      4. choosing shows a list of that iss' clients, and shows a delete button for all iss' clients
       */}
      <Tabs>
        <TabList>
          <Tab>Add Client</Tab>
          <Tab>All Clients</Tab>
          <Tab>All Iss</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AddClient />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default App
