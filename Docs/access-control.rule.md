# Access control

## authorization

the authorization will take place at each controller using permission decorator to set list the required permissions(object of action and model) and roles guard to verify the authorization of a user of any kind(admin, applicant,...) for the specific action

the authorization will be checked by two(three) set of rules

    -  the model
    -  action
    -  company(optional) adminstration tasks

## Guest role

    -  view jobs list(detail)
    -  view company list(detail((public view)))

## Applicant role

    -  view jobs list(detail)
    -  view company list(detail((public view)))
    -  apply for jobs
    -  view application status
    -  withdraw applicaiton if allowed by business logic
    -  manage profile

applying for jobs will be restircted - verification(period of time it can apply before bieng verified)

## Admin role

    -   other view company list(detail(public view))
    -   manage  application(update status or stages)
    -   manage  admin
    -   manage  profile
    -   manage  company information

each admin action the authroization will be based on company info(type and company id), action and model
