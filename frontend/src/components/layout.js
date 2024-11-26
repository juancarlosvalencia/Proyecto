import { Flex } from "@chakra-ui/react"

const Layout = ({children}) => {
    return (
        <Flex bg='white' w='100vw' h='100vh' justifyContent='center' alignItems='center'>
            <div id="alertaError" className="alert alert-danger alert-dismissible fade show" role="alert">
              <span className="texto"></span>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>

            <div id="alertaExito" className="alert alert-success alert-dismissible fade show" role="alert">
              <span className="texto"></span>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            {children}
        </Flex>
    )
}

export default Layout;