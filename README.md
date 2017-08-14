# SendEmailNodeAPI

EndPoint for AppIOT which uses Sendgrid for Sending Emails.

### Installation

```bash
# Install all needed packages
npm install

# Starting the application
# export SENDGRID_API_KEY=<sendGrid_API_KEY>

npm start

```

### Deployment to Azure

* Create a new APP Service and deploy using github.
* Go to Application Setting and add new env. variable with key SENDGRID_API_KEY and value from sendgrid configuration.
