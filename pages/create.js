import React from "react";
import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon
} from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

//  Instead of declaring our state object directly in our useState hook, we can declare it here,
//  so when we want to clear the form fields, we use these initial values once again
const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: ""
};

function CreateProduct() {
  // Using this method to manage the state for all form fields instead of managing each
  // bit of state individually.
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    //  Do we have a completely filled out product ie, every form field has content
    const isProduct = Object.values(product).every(el => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(event) {
    // the event object automatically gets passed on onChange.  We can access the name and value of that object
    // for each of our form fields
    const { name, value, files } = event.target;
    if (name === "media") {
      setProduct(prevState => ({ ...prevState, media: files[0] }));
      //  set state for our image upload
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      //  use the [] around name to tell javascript to tell react that 'name' is a variable and not a string.
      //  This is what is calla computed property
      //  We could use: setProduct({ [name]: value }), but every time there is an onChange,
      //  it creates a new object and we want to keep adding to the same object. so use the updater pattern
      setProduct(prevState => ({ ...prevState, [name]: value }));
    }
  }

  async function handleSubmit(event) {
    try {
      //  By default, a normal HTML form element is going to submit the form to a back end
      //  and by default refresh the page.  We want to stop it from doing that:
      event.preventDefault();
      setLoading(true);
      setError("");
      const mediaUrl = await handleImageUpload();
      //console.log({ mediaUrl });
      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = { name, price, description, mediaUrl };
      const response = await axios.post(url, payload);
      console.log(response);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    //  'damagedrecords refers to our preset upload settings we specified on cloudinary
    data.append("upload_preset", "damagedrecords");
    data.append("cloud_name", "chrischartranddevelopment");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        {/* This Message will appear when the success state is true as used in the Form component above */}
        <Message error header="Oops!" content={error} />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Form.Group width="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            // type="text" BY DEFAULT
            // handleChange is the standard method name when handling onChange event
            onChange={handleChange}
            value={product.name}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="1.00"
            type="number"
            onChange={handleChange}
            value={product.price}
          />
          <Form.Field
            control={Input}
            name="media"
            label="Media"
            content="Select Image"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          // type="text" BY DEFAULT
          onChange={handleChange}
          value={product.description}
        />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
