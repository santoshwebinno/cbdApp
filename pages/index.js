import { 
  Page,
  Card,
  ResourceList,
  ResourceItem,
  Thumbnail,
  TextStyle,
  Stack, 
  Button,
  Pagination,
  PageActions,
  Spinner,
  Checkbox
} from "@shopify/polaris";
import ToggleSwitch  from "../components/ToggleSwitch";
import { useEffect, useState } from "react";
import {Toast} from '@shopify/app-bridge/actions';
import {ImagesMajor} from '@shopify/polaris-icons';

const Index = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectProduct, setSelectProduct] = useState([]);
  const [hasPrevious, setHasPrevious]= useState(false);
  const [hasNext, setHasNext]= useState(false);
  const [nextPage, setNextPage] =useState('');
  const [prevPage, setPrevPage] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  /** */
  const handleChange = (ev) => {
    console.log(ev);
    setChecked(!checked);
    var d =document.getElementsByClassName('switch');
    if(ev === true){
      for (var i of d) {
        i.classList.add("active");
      }
    }else{
      setSelectProduct([]);
      for (var i of d) {
        i.classList.remove("active");
      }
    }
  }
  /** */
  const renderSelectPro = (ev, id) => {
    var clsck = false;
    ev.currentTarget.classList.forEach((cls)=>{
      if(cls == "active"){
        clsck = true;
      }
    })
    var data = selectProduct;
    if(clsck == true) {
      var ind = data.findIndex(x=> x==id);
       data.splice(ind, 1);
      ev.currentTarget.classList.remove("active");
    } else {
      data.push(id);
      ev.currentTarget.classList.add("active");
    }
    setSelectProduct(data);
  }
  const handleSubmit = () => {
    // var d =document.getElementsByClassName('switch');
    // for (var i of d) {
    //   i.classList.remove("active");
    // }
    console.log(checked);
    
    setBtnLoading(true);
    props.authAxios.post("/selectProducts", {"shop": props.shopOrigin,selectProduct: selectProduct, checked: checked}).then((response) => {
      setBtnLoading(false);
      getselectProducts();
      const toastNotice = Toast.create(props.app, {message: 'Selected Product saved'});
      toastNotice.dispatch(Toast.Action.SHOW);
    });
  }
  const paginate = (name) => {
    setHasNext(false);
    setHasPrevious(false);
     if(name == 'next') {
      getProducts(nextPage, selectProduct, checked);
     } else {
      getProducts(prevPage, selectProduct, checked);
    }
    var d = document.getElementsByClassName('switch');
    for (var i of d) {
      i.classList.remove("active");
    }
  }
  useEffect(() => {
    getselectProducts();
  }, [])
  function getselectProducts() {
    props.authAxios.get("/getselectProducts/?shop="+props.shopOrigin).then((response) => {
      if(response.data.product_ids !=undefined){
        setChecked(response.data.allselect)
        setSelectProduct(JSON.parse(response.data.product_ids));
        getProducts('', JSON.parse(response.data.product_ids), response.data.allselect);
      }else{
        getProducts('', [], response.data.allselect);
      }
    })
  }
  function getProducts(id, selectprodct, checked) {
    setLoading(true);
    props.authAxios.post("/getProducts", {"shop": props.shopOrigin, id: id}).then((response) => {
      if (response.data.nextpage) {
        setNextPage(response.data.nextpage);
        setHasNext(true);
      } else {
        setHasNext(false);
      }
      if (response.data.prevpage) {
        setHasPrevious(true);
        setPrevPage(response.data.prevpage)
      } else {
        setHasPrevious(false);
      }

      var productss = [];
      for(let products of response.data.products){
        var product = products;
        if(checked){
          product.checked = true;
        }else{
          var check = selectprodct.find(x => x == products.id);
          if(check != undefined){
            product.checked = true;
          } else {
            product.checked = false;
          }
        }
        productss.push(product)
      }
      setProducts(productss);
      setLoading(false);
    })
  }
  
    return (
      <Page 
        title="Manage Products"
        primaryAction={
          <Button
            primary
            onClick={handleSubmit}
            loading={btnLoading}
          >
            Save
          </Button>
        }
        >
          <div style={{'padding': '14px', 'textAlign': 'right'}}>
          <Checkbox
            label="Select All"
            checked={checked}
            onChange={handleChange}
          />
          </div>
          
        <Card>
        {loading ?
        <div style={{textAlign: "center"}}>
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>
          
        :
        <>
        <ResourceList
          loading={loading}
          resourceName={{singular: 'Product', plural: 'products'}}
          items={products}
          renderItem={(item) => {
            const {id, images, title, handle, checked} = item;
            let media = '';
            if(images.length > 0){
              media = <Thumbnail source={images[0].src} alt={title} size="small"/>;
            }else{
              media = <Thumbnail source={ImagesMajor} size="small" alt="Small document" />
            }

            return (
              <ResourceItem
                id={id}
                media={media}
                accessibilityLabel={`View details for ${title}`}
              >
                <div style={{'marginTop': '7px'}}>
                <Stack>
                  <Stack.Item fill>
                    <TextStyle variation="strong">{title}</TextStyle>
                  </Stack.Item>
                  <Stack.Item>
                    <ToggleSwitch Name={handle} renderSelectPro={renderSelectPro} id={id} checked={checked}/>
                  </Stack.Item>
                </Stack>
                </div>
              </ResourceItem>
            );
          }}
        />
        </>
      }
        </Card>
        <PageActions
          primaryAction={{
            content: 'Save',
            onAction: handleSubmit,
            loading: btnLoading
          }}
          
        />
        <Pagination
          hasPrevious={hasPrevious}
          onPrevious={() => {
            paginate('prev')
          }}
          hasNext={hasNext}
          onNext={() => {
            paginate('next')
          }}
        />
        
      </Page>
    );
  }
export default Index;
