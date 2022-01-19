import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
// import Toast from "../Notification/Toast";
// import MEModal from "../Widgets/MEModal";
import MEFormGenerator from "../Widgets/FormGenerator/MEFormGenerator";
import { getPropsArrayFromJsonArray } from "../../Utils";
import {reduxLoadTestimonials} from "../../../redux/actions/pageActions"

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
        resetKey:"--"
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
        resetKey:"--" 
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
        modalContainerClassName:"me-f-c-pos-correction",
        showOverlay:false,
        maxHeight:1000, 
        maxWidth:1000,
        },
      {
        type: "textarea",
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
    //if (this.state.preferredName === "")
    //  this.setState({ preferredName: this.props.user.preferredName });
    return (
      <MEFormGenerator
        inputData = {this.props.draftTestimonialData}
        style={{ background: "white", borderRadius: 10 }}
        className="z-depth-1"
        fields={this.getNeededFormFields()}
        title={this.state.message}
        onSubmit={this.onSubmit}
        info={this.state.formNotification}
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
    this.setState({
      formNotification: {
        icon: "fa fa-spinner fa-spin",
        type: "good",
        text: "We are sending now...",
      },
    });
    const communityID = community ? { community_id: community.id } : {};
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
      var Url = "testimonials.add"
      //if the body has a key, that means the data being submitted is for updating a draft testimonial and updates the URL
      if (body.key) {
        Url = "testimonials.update";
        delete body.key;
        //prevents front end fron submitting null data to back end causing the picture to be overwritten 
        //also prepares the image to be deleted if another one is not uploaded to replace it
				if (body?.image === null || body?.image === undefined || body?.image?.hasOwnProperty("url") ) {
					//marks the  image to be deleted from  the back end if the user removes image from draft and submits it with no image
          if (body?.ImgToDel) {
						body.image = "ImgToDel ---"  + String(body?.ImgToDel.id);
					} else {
						delete body.image;
					}	
				}
				delete body?.ImgToDel;
      }
      console.log("testimonial body", body)
      apiCall(Url, body).then((json) => {
        if (json && json.success) {
          this.setState({
            formNotification: {
              icon: "fa fa-check",
              type: "good",
              text:
                "Nicely done! Your story will be reviewed and published as soon as possible. Stay tuned!",
            },
          });
          resetForm();
            //reloads the testimonials list to the user can see the updated testimonial
              apiCall("testimonials.list", {subdomain: this.props.community.subdomain}).then(
                (json) => {
                  this.props.reduxLoadTestimonials(json.data)
                })
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
  reduxLoadTestimonials
}
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(mapStoreToProps, mapDispatchToProps)(StoryForm);
