import React from 'react'
//import './navbar.css';
import { Stack, HStack, VStack,Center,Text} from '@chakra-ui/react'
const Navbar = () => {
  return (
    <>
    {/* <div className="board" style={{backgroundColor:'black',color:'white',fontFamily:'monospace', padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
              <div className="data" style={{textAlign:'center'}}>ADMIN</div>

    </div> */}

<VStack
 
 align='stretch'
>
 <Center h='40px' bg='black' m={0} color='white' >
  <Text>ADMIN DASHBOARD</Text>
 </Center>

</VStack>
    
    </>
  )
}

export default Navbar