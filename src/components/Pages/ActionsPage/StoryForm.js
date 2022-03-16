import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
// import Toast from "../Notification/Toast";
// import MEModal from "../Widgets/MEModal";
import MEFormGenerator from "../Widgets/FormGenerator/MEFormGenerator";
import { getPropsArrayFromJsonArray } from "../../Utils";
import { reduxLoadTestimonials } from "../../../redux/actions/pageActions";
import MEButton from "../Widgets/MEButton";

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
  title: "",
  body: "",
  aid: "--",
  vid: "--",
  vendor: "",
  //preferredName: "",
  picFile: null,
  message: "Already completed an action? Tell Us Your Story",
  limit: 9000,
};



var ActionFormData = [	  {
  type: "input",
  name: "title",
  hasLabel: true,
  label: "Action Name *",
  placeholder: "Add a name... *",
  required: true,
  value: "",
},

{
  type: "input",
  name: "featured_summary",
  hasLabel: true,
  label: "Description *",
  placeholder: "Please add a description... *",
  required: true,
  value: "",
},

{
  type: "file",
  name: "image",
  hasLabel: true,
  label:
    "You can add an image to your action. It should be your own picture, or one you are sure is not copyrighted material",
  modalContainerClassName: "me-f-c-pos-correction",
  showOverlay: false,
  maxHeight: 1000,
  maxWidth: 1000,
},

{ 
  type: "html-field",
  name: "steps_to_take",
  hasLabel: true,
  label: "Action steps * ( limit: 9000 Char's)",
  placeholder: "action steps...*",
  value: "",
  required: true,
}	]




var EventsFormData = 	[
  {
    type: "input",
    name: "name",
    hasLabel: true,
    label: "Event Name *",
    placeholder: "Add a name... *",
    required: true,
    value: "",
  },
  {
    type: "input",
    name: "description",
    hasLabel: true,
    label: "Event description *",
    placeholder: "Add a description... *",
    required: true,
    value: "",
  },
  {
    type: "date",
    name: "start_date_and_time",
    hasLabel: true,
    label: "Start Date *",
    placeholder: "Add a Date ... *",
    required: true,
    value: "2022-01-02",
  },
 {
    type: "date",
    name: "end_date_and_time",
    hasLabel: true,
    label: "End Date *",
    placeholder: "Add a Date ... *",
    required: true,
    value: "2022-01-02",
  },

  {
    type: "input",
    name: "address",
    hasLabel: true,
    label: "Address *",
    placeholder: "Add an address... *",
    required: true,
    value: "",
  },
      
{
    type: "input",
    name: "city",
    hasLabel: true,
    label: "City Name *",
    placeholder: "Add a city... *",
    required: true,
    value: "",
  },

  {
    type: "input",
    name: "state",
    hasLabel: true,
    label: "State *",
    placeholder: "Add a name... *",
    required: true,
    value: "",
  },

 {
    type: "file",
    name: "image",
    hasLabel: true,
    label:
      "You can add an image to your testimonial. It should be your own picture, or one you are sure is not copyrighted material",
    modalContainerClassName: "me-f-c-pos-correction",
    showOverlay: false,
    maxHeight: 1000,
    maxWidth: 1000,
  },
]


var VendorFormData = [
  {
    type: "input",
    name: "name",
    hasLabel: true,
    label: "Vendor Name *",
    placeholder: "Add a name... *",
    required: true,
    value: "",
  },
  {
    type: "input",
    name: "phone_number",
    hasLabel: true,
    label: "Phone Number *",
    placeholder: "Add a Phone Number... *",
    required: true,
    value: "",
  },
  {
    type: "input",
    name: "email",
    hasLabel: true,
    label: "Email *",
    placeholder: "Add an email... *",
    required: true,
    value: "",
  },
      
{
    type: "input",
    name: "description",
    hasLabel: true,
    label: "Description *",
    placeholder: "Add a description... *",
    required: true,
    value: "",
  },

  {
    type: "input",
    name: "address",
    hasLabel: true,
    label: "Address *",
    placeholder: "Add an address... *",
    required: true,
    value: "",
  },

  {
    type: "input",
    name: "website",
    hasLabel: true,
    label: "Website *",
    placeholder: "Add a Website... *",
    required: true,
    value: "",
  },

  {
    type: "input",
    name: "key_contact",
    hasLabel: true,
    label: "Key Contact *",
    placeholder: "Add a Key Contact... *",
    required: true,
    value: "",
  },
  

 {
    type: "file",
    name: "image",
    hasLabel: true,
    label:
      "You can add an image to your testimonial. It should be your own picture, or one you are sure is not copyrighted material",
    modalContainerClassName: "me-f-c-pos-correction",
    showOverlay: false,
    maxHeight: 1000,
    maxWidth: 1000,
  }
]

class StoryForm extends React.Component {
  constructor(props) {
    super();
    this.closeToast = this.closeToast.bind(this);
    var message = "Already completed an action? Tell Us Your Story";
    if (props.aid)
      message = "Already completed this action? Tell Us Your Story";
    // if (props.vid) message = "Already used this vendor? Tell Us Your Story";

    this.state = {
      ...INITIAL_STATE,
      vid: props.vid ? props.vid : "--",
      aid: props.aid ? props.aid : "--",
      captchaConfirmed: false,
      message: message,
      picFile: null,
      //preferredName: "",
      notificationState: null,
      spinner: false,
      formNotification: null,
      formReset: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  categories() {
    const cat = this.props.tagCollections;
    if (cat) {
      return cat.filter((item) => item.name === "Category")[0];
    }
    return null;
  }
  ejectCategories() {
    if (this.categories()) {
      return this.categories().tags.map((cat) => <option>{cat.name}</option>);
    }
  }

  ejectSelectedTags() {
    return this.state.selected_tags.map((item, key) => {
      return (
        <small
          onClick={() => {
            this.removeTag(item.id);
          }}
          key={key.toString()}
          className="sm-tag-hover"
          style={{
            cursor: "pointer",
            border: "solid 1px #f5f4f4",
            color: "#888",
            borderRadius: 55,
            margin: 5,
            padding: "5px 40px",
          }}
        >
          {" "}
          {item.name} <i style={{ marginLeft: 5 }} className="fa fa-close " />
        </small>
      );
    });
  }
  //handlePreferredName(event) {
  //  const val = event.target.value;
  //  var string = val.trim() !== "" ? val.trim() : null;
  //  this.setState({ preferredName: string });
  //}

  closeToast() {
    this.setState({ notificationState: null });
  }
  chooseFile(e) {
    e.preventDefault();
    document.getElementById("picFile").click();
  }

  getNeededFormFields() {


    if (this.props.ModalType  === "action") {
        return ActionFormData
    }
    if (this.props.ModalType  === "events") {
        return EventsFormData
    }

    if (this.props.ModalType  === "vendors") {
        return VendorFormData
    }
    const actionTitles = getPropsArrayFromJsonArray(
      this.props.actions,
      "title"
    );
    const actionIds = getPropsArrayFromJsonArray(this.props.actions, "id");
    const vendorTitles = getPropsArrayFromJsonArray(this.props.vendors, "name");
    const vendorIds = getPropsArrayFromJsonArray(this.props.vendors, "id");
    return [
      {
        name: "action_id",
        hasLabel: true,
        label: "Which action is this testimonial about?",
        type: "dropdown",
        placeholder: "Select Action",
        data: ["--", ...actionTitles],
        dataValues: ["--", ...actionIds],
        value: "--",
        resetKey: "--",
      },
      {
        name: "vendor_id",
        hasLabel: true,
        label: "Who helped you complete this action?",
        type: "dropdown",
        placeholder: "Select Action",
        data: ["--", ...vendorTitles],
        dataValues: ["--", ...vendorIds],
        value: "--",
        resetKey: "--",
      },
      {
        type: "input",
        name: "other_vendor",
        hasLabel: true,
        label: "Specify vendor if  not on the list (optional) ",
        placeholder: "Name of vendor...",
        value: "",
      },
      {
        type: "input",
        name: "preferred_name",
        hasLabel: true,
        label:
          "Your name and email will be known to the Community Organizer but how would you like it to be displayed?",
        placeholder: "Name...",
        value: this.props.user?.preferred_name,
        required: true,
      },
      {
        type: "input",
        name: "title",
        hasLabel: true,
        label: "Story Title *",
        placeholder: "Add a title... *",
        required: true,
        value: "",
      },
      {
        type: "file",
        name: "image",
        hasLabel: true,
        label:
          "You can add an image to your testimonial. It should be your own picture, or one you are sure is not copyrighted material",
        modalContainerClassName: "me-f-c-pos-correction",
        showOverlay: false,
        maxHeight: 1000,
        maxWidth: 1000,
      },
      // {
      //   type: "textarea",
      //   name: "body",
      //   hasLabel: true,
      //   label: "Your Story * ( limit: 9000 Char's)",
      //   placeholder: "Your story...*",
      //   value: "",
      //   required: true,
      // },
      {
        type: "html-field",
        name: "body",
        hasLabel: true,
        label: "Your Story * ( limit: 9000 Char's)",
        placeholder: "Your story...*",
        value: "",
        required: true,
      },
    ];
  }
  render() {
    // const cols = this.props.tagCollections;
    if (!this.props.actions || this.props.actions.length === 0)
      return (
        <div className="text-center">
          <p> Sorry, there are no actions to submit a story about </p>
        </div>
      );
    if (this.state.vid !== "other" && this.state.vendor !== "")
      this.setState({ vendor: "" });
    return (
      <MEFormGenerator
        TriggerModal={(bool) => this.props.TriggerModal(bool)}
        inputData={this.props.draftTestimonialData}
        style={{ background: "white", borderRadius: 10 }}
        className="z-depth-1"
        fields={this.getNeededFormFields()}
        title={this.state.message}
        onSubmit={this.onSubmit}
        info={this.state.formNotification}
        onMount={(reset) => this.setState({ formReset: reset })}
        moreActions={
          <>
            <MEButton
              style={{
                background: "rgb(209 70 70)",
                color: "white",
                borderColor: "rgb(209 70 70)",
              }}
              className="touchable-opacity"
              type="button"
              onClick={() => {
                this.props.close && this.props.close();
              }}
              containerStyle={{
                padding: "10px 12px",
                fontSize: 18,
              }}
            >
              Cancel
            </MEButton>
            <MEButton
              variation="accent"
              type="button"
              onClick={() => {
                this.state.formReset && this.state.formReset();
              }}
              containerStyle={{
                padding: "10px 12px",
                fontSize: 18,
              }}
            >
              Clear
            </MEButton>
          </>
        }
      />
    );
  }
  count = (words) => {
    // return words.split(' ').length //word count
    return words.length; //char count
  };
  //updates the state when form elements are changed
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  renderOptions(choices) {
    return Object.keys(choices).map((key) => {
      var choice = choices[key];
      return (
        <option value={choice.id} key={key}>
          {" "}
          {choice.title ? choice.title : choice.name}{" "}
        </option>
      );
    });
  }
  onSubmit(event, data, resetForm) {
    const { community, user } = this.props;
    event.preventDefault();
    if (!data || data.isNotComplete) {
      return;
    }
    var Url = ""
    var body = ""
    const communityID = community ? { community_id: community.id } : {};
    if (this.props.ModalType  === "action") {
      body = {...data,...communityID }
      Url = "actions.add";

      if (this.count(body.title) < 6) {
        this.setState({
          formNotification: {
            icon: "fa fa-times",
            type: "bad",
            text: "Sorry, your title needs to be longer..",
          },
        });
        return 
      }
      apiCall(Url, body).then((json) => {
        if (json && json.success) {
          if (this.props?.TriggerSuccessNotification) {
            this.props.TriggerSuccessNotification(true);
            this.props.TriggerModal(false);
          } 
        } 
      });





    } 
    
    else if (this.props.ModalType  === "events") {
      Url = "events.add"
      body = {...data,...communityID, ...{"have_address": true} }
      var location = {
        "city": body.city,
        "unit": null,
        "state": body.state,
        "address": body.address,
        "country": null,
        "zipcode": null
      }
      body.location = location
      
      if (this.count(body.name) < 4) {
        this.setState({
          formNotification: {
            icon: "fa fa-times",
            type: "bad",
            text: "Sorry, your name needs to be longer..",
          },
        });
        return 
      }
      apiCall(Url, body).then((json) => {
        if (json && json.success) {
          if (this.props?.TriggerSuccessNotification) {
            this.props.TriggerSuccessNotification(true);
            this.props.TriggerModal(false);
          } 
        } 
      });
    }


    else if (this.props.ModalType === "vendors") {
      Url = "vendors.add"
      body = {...data,...communityID}
      
      
      if (this.count(body.name) < 4) {
        this.setState({
          formNotification: {
            icon: "fa fa-times",
            type: "bad",
            text: "Sorry, your name needs to be longer..",
          },
        });
        return 
      }
      apiCall(Url, body).then((json) => {
        var ErrorMessage  = ""
        if (json && json.success) {
          if (this.props?.TriggerSuccessNotification) {
            this.props.TriggerSuccessNotification(true);
            this.props.TriggerModal(false);
          } 
        } else if (json.error.includes("duplicate key value violates unique constraint")) {
          ErrorMessage = "Sorry, the vendor name already exists in the database.."
        } 
        else if (json.error.includes("Vendor submission incomplete"))  {
          ErrorMessage = "Vendor submission is incomplete. Please confirm you entered a valid email"
        }


        this.setState({
          formNotification: {
            icon: "fa fa-times",
            type: "bad",
            text: ErrorMessage,
          },
        })
        return
      });
    }
    
    else {
      this.setState({
        formNotification: {
          icon: "fa fa-spinner fa-spin",
          type: "good",
          text: "We are sending now...",
        },
      });
      
      const userEmail = user ? { user_email: user.email } : {};
      const body = { ...data, rank: 0, ...communityID, ...userEmail };
      if (this.count(this.state.body) > this.state.limit) {
        this.setState({
          formNotification: {
            icon: "fa fa-times",
            type: "bad",
            text: "Sorry, your story is a bit too long..",
          },
        });
      } else {
         Url = "testimonials.add";
        //if the body has a key, that means the data being submitted is for updating a draft testimonial and updates the URL
        if (body.key) {
          Url = "testimonials.update";
          delete body.key;
          //prevents front end fron submitting null data to back end causing the picture to be overwritten
          //also prepares the image to be deleted if another one is not uploaded to replace it
          if (
            body?.image === null ||
            body?.image === undefined ||
            body?.image?.hasOwnProperty("url")
          ) {
            //marks the  image to be deleted from  the back end if the user removes image from draft and submits it with no image
            if (body?.ImgToDel) {
              body.image = "ImgToDel ---" + String(body?.ImgToDel.id);
            } else {
              delete body.image;
            }
          }
          delete body?.ImgToDel;
        }
        apiCall(Url, body).then((json) => {
          if (json && json.success) {
            if (this.props?.TriggerSuccessNotification) {
              this.props.TriggerSuccessNotification(true);
              this.props.TriggerModal(false);
            } else {
              this.setState({
                formNotification: {
                  icon: "fa fa-check",
                  type: "good",
                  text: "Nicely done! Your story will be reviewed and published as soon as possible. Stay tuned!",
                },
              });
              resetForm();
            }
            //reloads the testimonials list to the user can see the updated testimonial
            apiCall("testimonials.list", {
              subdomain: this.props.community.subdomain,
            }).then((json) => {
              this.props.reduxLoadTestimonials(json.data);
            });
          } else {
            this.setState({
              formNotification: {
                icon: "fa fa-times",
                type: "bad",
                text: "Something happened, we could not send your story!",
              },
            });
          }
        });
      }
    }

  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    actions: store.page.actions,
    vendors: store.page.serviceProviders,
    community: store.page.community,
    //tagCollections: store.page.tagCols
  };
};

const mapDispatchToProps = {
  reduxLoadTestimonials,
};
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(mapStoreToProps, mapDispatchToProps)(StoryForm);
