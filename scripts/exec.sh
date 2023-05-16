sam build
sam deploy --no-confirm-changeset --capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --stack-name $2 --profile $3  --region $4  $5
