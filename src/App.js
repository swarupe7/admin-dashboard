import { Input, VStack,Center,Box,IconButton, ButtonGroup, InputGroup,useToast} from '@chakra-ui/react'
import {useState,useEffect} from 'react';
import {ArrowBackIcon,CheckCircleIcon, ArrowForwardIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import './App.css';
import Navbar from './Navbar';

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [sign,setSign]=useState(false);
 
  const [filteredUsers, setFilteredUsers] = useState([]); 
 const [values,setValues]=useState({ name:"",email:"",role:""});
  const [editId,setEditId]=useState(null);
  useEffect(() => {
    // Fetch users from the API
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then((response) => response.json())
      .then((data) => {setUsers(data);
       });
  }, []);

  useEffect(() => {
    // Update filtered users when search term changes
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);
 
  

  const handleSearch = () => {
   
    
    // Reset to the first page after searching
    if(filteredUsers.length===0){
      setCurrentPage(0);
      return toast({
        title: 'Sorry data is not available',
        description: "We couldnt find requested data.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

    }
    setCurrentPage(1); 

   
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const handleSelectAll = () => {
    setIsChecked(!isChecked);
   
    if (selectedRows.length === displayedUsers.length) {
      setSelectedRows([]);
    } else {
      // Select all rows
      const allUserIds = displayedUsers.map((user) => user.id);
      setSelectedRows(allUserIds);
    }

    
  };

  const handleSelectRow = (id) => {
     setSign(!sign);
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleSearchKeyDown = (e) => {
    // Check if the pressed key is Enter
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const toast=useToast();
  const handleDeleteSelected = () => {
    if(selectedRows.length===0) {
      return toast({
        title: 'Choose records to delete',
        description: " select records to delete.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    if(isChecked){
      setIsChecked(false);
    }   
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !selectedRows.includes(user.id))
    );
    setSelectedRows([]);
    return toast({
      title: 'Records Deleted',
      description: "We had deleted selected records.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  };

  const handleDelete=(userId)=>{
    console.log('delete selected')
    setUsers((prevUsers) =>
    prevUsers.filter((user) => user.id !== userId)
  );
  };   

  const handleEdit=(userId)=>{
    setEditId(userId);

  }
  const handleUpdate=()=>{

    const editedUser = filteredUsers.find((user) => user.id === editId);

  // Check if the user is found
  if (editedUser) {
    // Update the user's name
    const updatedUsers = users.map((user) =>
      user.id === editId ? { ...user, name: values.name,email:values.email,role:values.role } : user
    );

    // Update the state with the new user data
    setUsers(updatedUsers);
  }

  // Reset the editing state
  setEditId(null);

  // Clear the input values
  setValues({ name: '', email: '', role: '' });

  // Display a success toast message
  toast({
    title: 'Record Updated',
    description: 'The record has been successfully updated.',
    status: 'success',
    duration: 5000,
    isClosable: true,
  });



  }

  return (
    <>
   <Navbar/>
   <br/>
   <Center align='stretch'>
   
   
   <VStack spacing={2} >
      
      
   <InputGroup size='md' gap={1}>
      <Input type="text"
        id="search"
        placeholder="Search through names,emails,roles...(HIT ENTER TO WORK)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e)=>handleSearchKeyDown(e)}
        size='md' />
      <IconButton
       
       onClick={handleDeleteSelected} disabled={selectedRows.length === 0}
       colorScheme='red'
       aria-label='Search database'
        icon={<DeleteIcon />}
      />
      </InputGroup>
      
       <Box>
        <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>
              <input type="checkbox" onChange={handleSelectAll}  checked={isChecked} />
            </Th>
            <Th>ID    </Th>
            <Th>Name  </Th>
            <Th>Email </Th>
            <Th>Role  </Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayedUsers.map((user) => (
            <Tr
              key={user.id}
              className={selectedRows.includes(user.id) ? 'selected' : ''}
              style={{ backgroundColor: selectedRows.includes(user.id) ? 'grey' : 'unset' }}
            >
              <Td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  //checked={( isChecked || selectedRows.includes(user.id) ) && page=== currentPage  }
                  onChange={() => handleSelectRow(user.id)}
                />
              </Td>
              <Td>{user.id}                         </Td>
              <Td  >
              {editId === user.id ? (
          <Input
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        ) : (
          user.name
        )}
              </Td>
              <Td>
              {editId === user.id ? (
          <Input
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        ) : (
          user.email
        )}              </Td>
              <Td  >   
              {editId === user.id ? (
          <Input
            value={values.role}
            onChange={(e) => setValues({ ...values, role: e.target.value })}
          />
        ) : (
          user.role
        )}
                
                  </Td>
              <Td>

              <ButtonGroup gap='1'>
               {editId===user.id ?(
                <IconButton
                colorScheme='green'
                aria-label='edit-page'
                className='save'
                onClick={handleUpdate}
                 icon={<CheckCircleIcon/>} />
      )
          :
          (
            <IconButton
      colorScheme='green'
      aria-label='edit-page'
      className='edit'
      onClick={()=>handleEdit(user.id)}
       icon={<EditIcon/>} />


          )

          
          
          } 
      <IconButton
      
      colorScheme='red'
      aria-label='delete'
      className='delete'
      onClick={()=>handleDelete(user.id)}
        

       icon={<DeleteIcon />}
     />
     </ButtonGroup>
                
                 
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      </TableContainer>
      </Box>
       <Box>
      <div className="pagination">

      <ButtonGroup gap='1'>
       

        <IconButton
      
      colorScheme='blue'
      aria-label='first-page'
      className='first-page'
      onClick={() => handlePagination(1)}
         disabled={currentPage === 1}

       icon={<ArrowLeftIcon/>}
     />
        

        <IconButton
      
       colorScheme='blue'
       aria-label='previous-page'
       className='previous-page'
       onClick={() => currentPage===1?handlePagination(totalPages): handlePagination(currentPage - 1)}
          disabled={currentPage === 1}

        icon={<ArrowBackIcon />}
      />

      </ButtonGroup>

        <span>{" "}Page {currentPage} of {totalPages}{" "}</span>
        
        <ButtonGroup gap='1'>
        
        <IconButton
       colorScheme='blue'
       aria-label='next-page'
       className='next-page'
       onClick={() =>currentPage+1>totalPages?handlePagination(1): handlePagination(currentPage + 1)}
       disabled={currentPage === totalPages}
        icon={<ArrowForwardIcon />}
      />
      
      <IconButton  
      colorScheme='blue'
      aria-label='last-page'
      className='last-page'
      onClick={() => handlePagination(totalPages)}
         disabled={currentPage === totalPages - 1}
       icon={<ArrowRightIcon/>}
     />
     </ButtonGroup>      
      </div>      
      </Box>
      </VStack>
      
    </Center>
   
   

    </>
   
  );
}

export default App;
