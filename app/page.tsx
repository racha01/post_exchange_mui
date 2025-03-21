"use client";
import 'animate.css';
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { AppProvider, type Navigation, Branding } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import { useDemoRouter } from '@toolpad/core/internal';
import { useDemoRouter } from '@toolpad/core/internal';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import StorageTwoToneIcon from '@mui/icons-material/StorageTwoTone';
import ChecklistTwoToneIcon from '@mui/icons-material/ChecklistTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { useRouter } from 'next/navigation'
import { PageContainer } from '@toolpad/core';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import HomeComponent from '@/app/pages/home'
import InspectionData from './pages/inspection_data';
import MasterData from '@/app/pages/master_data/index'
import MasterDataMenu1 from '@/app/pages/master_data/line'
import MasterDataMenu2 from '@/app/pages/master_data/menu2'
import { Margin, Padding, Search } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import PrecisionManufacturingTwoToneIcon from '@mui/icons-material/PrecisionManufacturingTwoTone';
import LineAddComponent from '@/app/components/LineAddComponent'
import EnhancedTable from '@/app/pages/inspection_data'
import Swal from 'sweetalert2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AppProps } from 'next/app';
import DeliveryDiningTwoToneIcon from '@mui/icons-material/DeliveryDiningTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import ShoppingBasketTwoToneIcon from '@mui/icons-material/ShoppingBasketTwoTone';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import Person2TwoToneIcon from '@mui/icons-material/Person2TwoTone';
import EnhancedTable1 from './components/DeliverGoodTable';
import DeliverGoodsAddComponent from './components/DeliverGoodsAdd';
import DeliverGoodsTable from './components/DeliverGoodTable';
import SellerTable from './components/SellerTable';
import SellerAddComponent from './components/SellerAdd';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason, SnackbarOrigin } from '@mui/material/Snackbar';
import { useSelector } from 'react-redux';
import CurrencyExchangeTwoToneIcon from '@mui/icons-material/CurrencyExchangeTwoTone';
import { useAppSelector } from './hooks';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ProductTable from './components/ProductTable';
import ProductAddComponent from '@/app/components/ProductAdd'
import DeliverGoodsPage from './pages/deliverGoodsPage';
import LineDetail from './line-detail/page';
import DeliverGoodsCutOffPage from './pages/deliverGoodsCutOffPage';
const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: '',
  },
  // {
  //   segment: 'home',
  //   title: 'Home',
  //   icon: <HomeTwoToneIcon />,
  // },
  // {
  //   segment: 'master-data',
  //   title: 'Master Data',
  //   icon: <StorageTwoToneIcon />,
  //   children: [
  //     {
  //       segment: 'line',
  //       title: 'Line',
  //       icon: <PrecisionManufacturingTwoToneIcon />,
  //     },
  //     {
  //       segment: 'menu2',
  //       title: 'menu2',
  //       icon: <HomeTwoToneIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment: 'inspection-data',
  //   title: 'Inspection Data',
  //   icon: <MenuTwoToneIcon />,
  // },
  // {
  //   segment: 'Administrator',
  //   title: 'Administrator',
  //   icon: <ChecklistTwoToneIcon />,
  //   children: [
  //     {
  //       segment: 'menu1',
  //       title: 'menu1',
  //       icon: <HomeTwoToneIcon />,
  //     },
  //     {
  //       segment: 'menu2',
  //       title: 'menu2',
  //       icon: <HomeTwoToneIcon />,
  //       children: [
  //         {
  //           segment: 'line',
  //           title: 'Line',
  //           icon: <PrecisionManufacturingTwoToneIcon />,
  //         },
  //         {
  //           segment: 'menu2',
  //           title: 'menu2',
  //           icon: <HomeTwoToneIcon />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    segment: 'cut-off',
    title: 'ยอดการส่งสินค้า',
    icon: <CurrencyExchangeTwoToneIcon />,
  },
  {
    segment: 'deliver-goods',
    title: 'รายการส่งสินค้า',
    icon: <DeliveryDiningTwoToneIcon />,
  },
  {
    segment: 'post-exchange',
    title: 'PX ร้อย.บก.',
    icon: <StorefrontTwoToneIcon />,
    children: [
      {
        segment: 'post-exchange-product',
        title: 'สินค้า PX',
        icon: <ShoppingBasketTwoToneIcon />,
      },
      {
        segment: 'post-exchange-stock',
        title: 'รายการซื้อของเข้า PX',
        icon: <Inventory2TwoToneIcon />,
      },
    ]
  },
  {
    segment: 'products',
    title: 'สินค้า',
    icon: <Inventory2TwoToneIcon />,
  },
  {
    segment: 'sellers',
    title: 'ผู้ส่งสินค้า',
    icon: <Person2TwoToneIcon />,
  },
];

const showAlertgg = () => {
  Swal.fire({
    title: "Custom Transition!",
    text: "This uses a fade-in animation.",
    icon: "success",
    showClass: {
      popup: "animate__animated animate__fadeInDown", // Custom transition classes
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
    customClass: {
      popup: "my-custom-popup", // Add custom MUI or CSS styles
    },
    backdrop: `rgba(0,0,0,0.4)`,
  });
};

const BRANDING: Branding = {
  title: "Post Exchange AFDC"
};
const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Noto Sans Thai',
    ].join(','),
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#EEEEF9',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function PageContent({
  pathname,
}: {
  pathname: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef(loading);
  const [pathName, setpathName] = React.useState<string>(pathname);
  const [id, setId] = React.useState(0)
  console.log("pathname")
  console.log(pathname)

  const handlePathName = (data: string, id: number) => {
    setpathName(data);
    setId(id);
  };

  const clickBack = (pathName: string) => {
    console.log("set path name")
    setpathName(pathName);
  }

  React.useEffect(() => {
    setpathName(pathname);
  }, [pathname]);

  const handleError = () => {
    alert('Div clicked!');
  };
  function handleClickWait() {
    setLoading(true);
  }

  async function handleWaitDataAsync() {
    setLoading(true);
  }

  async function handleGetDataAsync() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading(false);
  }

  async function handleFunctionAsync() {
    await handleWaitDataAsync();
    await handleGetDataAsync();
  }

  const [open, setOpen] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const { error } = useAppSelector((state) => state.seller);
  const handleClose = () => {
    setOpen(false);
  };

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));


  React.useEffect(() => {
    if (error) {
      setOpenSnackBar(true);
    }
  }, [error, setOpenSnackBar]);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >

      {pathName.startsWith('/home') ? (
        <Box sx={{ width: '100%', marginTop: '-32px' }}>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: '10px',
            }}
          >
            <Box>
              <h2>Home</h2>
            </Box>
            <Box>
              <LineAddComponent />
            </Box>
          </Grid>
          <HomeComponent pathNameFromComponent={handlePathName} />
        </Box>
      ) : null}
      {pathName.startsWith('/master-data/line') ? (
        <Box sx={{ width: '100%', marginTop: '-32px' }}>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: '10px',
            }}
          >
            <Box>
              <h2>Master Data Line</h2>
            </Box>
            <Box>
              <LineAddComponent />
            </Box>
          </Grid>
          <MasterDataMenu1 />
        </Box>
      ) : null}
      {pathName.startsWith('/master-data/menu2') ? (
        <MasterDataMenu2 />
      ) : null}
      {pathName.startsWith('/inspection-data') ? (
        <EnhancedTable />
      ) : null}
      {pathName.startsWith('/deliver-goods') ? (
        <DeliverGoodsPage />
      ) : null}
      {pathName.startsWith('/post-exchange/post-exchange-product') ? (
        <EnhancedTable />
      ) : null}
      {pathName.startsWith('/post-exchange/post-exchange-stock') ? (
        <EnhancedTable />
      ) : null}
      {pathName.startsWith('/product') ? (
        <Box sx={{ width: '100%', marginTop: '-32px' }}>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: '10px',
            }}
          >
            <Box>
              <h2>Products</h2>
            </Box>
            <Box>
              <ProductAddComponent />
            </Box>
          </Grid>
          <Box sx={{ position: 'absolute' }}>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={openSnackBar} autoHideDuration={3000}
              onClose={handleSnackbarClose}>
              <Alert
                onClose={handleSnackbarClose}
                severity="warning"
                sx={{ width: '100%' }}
              >
                {error?.detail}
              </Alert>
            </Snackbar>
          </Box>
          <ProductTable />
        </Box>
      ) : null}
      {pathName.startsWith('/sellers') ? (
        <Box sx={{ width: '100%', marginTop: '-32px' }}>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: '10px',
            }}
          >
            <Box>
              <h2>Sellers</h2>
            </Box>
            <Box>
              <Stack direction="row" spacing={2}>
                {/* <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search> */}
                <Box>
                  <SellerAddComponent />
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Box sx={{ position: 'absolute' }}>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={openSnackBar} autoHideDuration={3000}
              onClose={handleSnackbarClose}>
              <Alert
                onClose={handleSnackbarClose}
                severity="warning"
                sx={{ width: '100%' }}
              >
                {error?.detail}
              </Alert>
            </Snackbar>
          </Box>
          <SellerTable />
        </Box>

      ) : null}
      {pathName.startsWith('/line-detail-test') ? (
        <Box sx={{ width: '100%', marginTop: '-32px' }}>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: '10px',
            }}
          >

          </Grid>
          <Box sx={{ position: 'absolute' }}>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={openSnackBar} autoHideDuration={3000}
              onClose={handleSnackbarClose}>
              <Alert
                onClose={handleSnackbarClose}
                severity="warning"
                sx={{ width: '100%' }}
              >
                {error?.detail}
              </Alert>
            </Snackbar>
          </Box>
          <LineDetail id={id} clickBack={(pathName) => clickBack(pathName)} />
        </Box>

      ) : null}
      {pathName.startsWith('/cut-off') ? (
        <DeliverGoodsCutOffPage />
      ) : null}

    </Box>
  );
}

interface DemoProps {
  window?: () => Window;
}

export default function AppProviderTheme(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter('/cut-off');


  const demoWindow = window !== undefined ? window() : undefined;

  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={BRANDING}
      theme={customTheme}
      window={demoWindow}
    >
      <DashboardLayout sx={{ padding: '10px' }}>
        <PageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>

  );
}
