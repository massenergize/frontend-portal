import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import queryString from "query-string";
import Seo from "../../Shared/Seo";
import {
  reduxLoadPolicies,
  reduxMarkRequestAsDone,
} from "../../../redux/actions/pageActions";
import { PAGE_ESSENTIALS } from "../../Constants";
import { apiCall } from "../../../api/functions";

class PoliciesPage extends React.Component {
  fetchEssentials = () => {
    const { community, pageRequests } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain };
    const page = (pageRequests || {})[PAGE_ESSENTIALS.POLICIES.key];
    if (page?.loaded) return;
    Promise.all(
      PAGE_ESSENTIALS.POLICIES.routes.map((route) => apiCall(route, payload))
    )
      .then((response) => {
        const [settings] = response;
		this.props.reduxLoadPolicies(settings?.data);
        this.props.reduxMarkRequestAsDone({
          ...pageRequests,
          [PAGE_ESSENTIALS.POLICIES.key]: { loaded: true },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    this.fetchEssentials();
  }
  render() {
    const { community } = this.props;
    if (!this.props.policies) return <LoadingCircle />;
    return (
      <>
        {Seo({
          title: "Policies",
          description: "",
          url: `${window.location.pathname}`,
          site_name: community?.name,
        })}
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Policies" }]} />
          <div
            className="container p-5"
            style={{ height: window.screen.height - 200 }}
          >
            <Accordion defaultActiveKey="0">
              {this.renderPolicies(this.props.policies)}
            </Accordion>
          </div>
        </div>
      </>
    );
  }

  renderPolicies(policies) {
    const query = queryString.parse(this.props.location.search);
    if (query && query.name) {
      policies = policies.filter((p) => {
        return p.name === query.name;
      });
    }
    return Object.keys(policies).map((key) => {
      const policy = policies[key];
      return (
        <Card key={key}>
          <Accordion.Toggle as={Card.Header} eventKey={key}>
            {policy.name}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={key}>
            <Card.Body
              dangerouslySetInnerHTML={{ __html: policy.description }}
              className="rich-text-container"
            ></Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    });
  }
}

const mapStoreToProps = (store) => {
  return {
    policies: store.page.policies,
    community: store.page.community,
    pageRequests: store.page.pageRequests,
  };
};
export default connect(mapStoreToProps, {
  reduxMarkRequestAsDone,
  reduxLoadPolicies,
})(PoliciesPage);
