import { Branding, Navigation } from "@toolpad/core";
import {ReactRouterAppProvider} from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import StorageTwoToneIcon from '@mui/icons-material/StorageTwoTone';
import ChecklistTwoToneIcon from '@mui/icons-material/ChecklistTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

import DeliveryDiningTwoToneIcon from '@mui/icons-material/DeliveryDiningTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import ShoppingBasketTwoToneIcon from '@mui/icons-material/ShoppingBasketTwoTone';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import Person2TwoToneIcon from '@mui/icons-material/Person2TwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import PrecisionManufacturingTwoToneIcon from '@mui/icons-material/PrecisionManufacturingTwoTone';

const NAVIGATION: Navigation = [
    {
      kind: 'header',
      title: '',
    },
    {
      segment: 'home',
      title: 'Home',
      icon: <HomeTwoToneIcon />,
    },
    {
      segment: 'master-data',
      title: 'Master Data',
      icon: <StorageTwoToneIcon />,
      children: [
        {
          segment: 'line',
          title: 'Line',
          icon: <PrecisionManufacturingTwoToneIcon />,
        },
        {
          segment: 'menu2',
          title: 'menu2',
          icon: <HomeTwoToneIcon />,
        },
      ],
    },
    {
      segment: 'inspection-data',
      title: 'Inspection Data',
      icon: <MenuTwoToneIcon />,
    },
    {
      segment: 'Administrator',
      title: 'Administrator',
      icon: <ChecklistTwoToneIcon />,
      children: [
        {
          segment: 'menu1',
          title: 'menu1',
          icon: <HomeTwoToneIcon />,
        },
        {
          segment: 'menu2',
          title: 'menu2',
          icon: <HomeTwoToneIcon />,
          children: [
            {
              segment: 'line',
              title: 'Line',
              icon: <PrecisionManufacturingTwoToneIcon />,
            },
            {
              segment: 'menu2',
              title: 'menu2',
              icon: <HomeTwoToneIcon />,
            },
          ],
        },
      ],
    },
    {
      segment: 'deliver-goods',
      title: 'Deliver Goods',
      icon: <DeliveryDiningTwoToneIcon />,
    },
    {
      segment: 'post-exchange',
      title: 'Post Exchange',
      icon: <StorefrontTwoToneIcon />,
      children: [
        {
          segment: 'post-exchange-product',
          title: 'PX Master Product',
          icon: <ShoppingBasketTwoToneIcon />,
        },
        {
          segment: 'post-exchange-stock',
          title: 'Stock Product',
          icon: <Inventory2TwoToneIcon />,
        },
      ]
    },
    {
      segment: 'products',
      title: 'Product',
      icon: <Inventory2TwoToneIcon />,
    },
    {
      segment: 'sellers',
      title: 'Seller',
      icon: <Person2TwoToneIcon />,
    },
  ];
  
  
  
  const BRANDING: Branding = {
    title: "E-Checksheet System"
  };

export default function App(){

    return (
        <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
            <Outlet />
        </ReactRouterAppProvider>
    );
}