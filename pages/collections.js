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
    Spinner
  } from "@shopify/polaris";
  import ToggleSwitch  from "../components/ToggleSwitch";
  import { useEffect, useState } from "react";
  import {Toast} from '@shopify/app-bridge/actions';
  import {ImagesMajor} from '@shopify/polaris-icons';

const Collections = (props) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectCollection, setSelectCollection] = useState([]);
  const [hasPrevious, setHasPrevious]= useState(false);
  const [hasNext, setHasNext]= useState(false);
  const [nextPage, setNextPage] =useState('');
  const [prevPage, setPrevPage] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  
  const renderSelectPro = (ev, id) => {
    var clsck = false;
    ev.currentTarget.classList.forEach((cls)=>{
      if(cls == "active"){
        clsck = true;
      }
    })
    var data = selectCollection;
    if(clsck == true) {
      var ind = data.findIndex(x=> x==id);
       data.splice(ind, 1);
      ev.currentTarget.classList.remove("active");
    } else {
      data.push(id);
      ev.currentTarget.classList.add("active");
    }
    setSelectCollection(data);
  }
  const handleSubmit = () => {
    setBtnLoading(true);
    props.authAxios.post("/selectCollections", {"shop": props.shopOrigin,selectCollection: selectCollection}).then((response) => {
      setBtnLoading(false);
      getselectCollections();
      const toastNotice = Toast.create(props.app, {message: 'Selected Collection saved'});
      toastNotice.dispatch(Toast.Action.SHOW);
    });
  }
  const paginate = (name) => {
    setHasNext(false);
    setHasPrevious(false);
     if(name == 'next') {
        getCollection(nextPage, selectCollection);
     } else {
        getCollection(prevPage, selectCollection);
    }
    var d =document.getElementsByClassName('switch');
    for (var i of d) {
      i.classList.remove("active");
    }
  }
    useEffect(() => {
        getselectCollections();
      }, [])
      function getselectCollections() {
        props.authAxios.get("/getselectCollections/?shop="+props.shopOrigin).then((response) => {
          if(response.data.collection_ids !=undefined){
            setSelectCollection(JSON.parse(response.data.collection_ids));
            getCollection('', JSON.parse(response.data.collection_ids));
          }else{
            getCollection('', []);
          }
        })
      }
      function getCollection(id, selectCollect) {
        setLoading(true);
        props.authAxios.post("/getCollection", {"shop": props.shopOrigin, id: id}).then((response) => {
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
    
          var collectionss = [];
          for(let collecions of response.data.smartCollect){
            var  collecion = collecions;
            var check = selectCollect.find(x => x == collecions.id);
            if(check != undefined){
               collecion.checked = true;
            } else {
               collecion.checked = false;
            }
            collectionss.push(collecion)
          }
          setCollections(collectionss);
          setLoading(false);
        })
      }
      return (
        <Page 
          title="Manage Collections"
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
          <Card>
          {loading ?
          <div style={{textAlign: "center"}}>
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </div>
            
          :
          <ResourceList
            loading={loading}
            resourceName={{singular: 'Collection', plural: 'Collections'}}
            items={collections}
            renderItem={(item) => {
              const {id, image, title, handle, checked} = item;
              let media = '';
              if(image != undefined){
                media = <Thumbnail source={image.src} alt={title} size="small"/>;
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
export default Collections;
