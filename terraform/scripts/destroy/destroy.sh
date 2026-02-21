#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./terraform/scripts/destroy/destroy.sh <dev|staging|prod|all> [--auto-approve] [--skip-plan] [--yes-prod]

Examples:
  ./terraform/scripts/destroy/destroy.sh dev
  ./terraform/scripts/destroy/destroy.sh staging --auto-approve
  ./terraform/scripts/destroy/destroy.sh all

Notes:
  - Runs terraform init, plan -destroy, and destroy for each selected environment.
  - Uses these tfvars files from terraform/:
      terraform.dev.tfvars
      terraform.staging.tfvars
      terraform.prod.tfvars
  - For safety, prod destroy requires interactive confirmation unless --yes-prod is provided.
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

TARGET_ENV="$1"
shift

AUTO_APPROVE=false
SKIP_PLAN=false
YES_PROD=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --auto-approve)
      AUTO_APPROVE=true
      shift
      ;;
    --skip-plan)
      SKIP_PLAN=true
      shift
      ;;
    --yes-prod)
      YES_PROD=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

destroy_env() {
  local env="$1"
  local env_dir="${TERRAFORM_DIR}/environments/${env}"
  local var_file="${TERRAFORM_DIR}/terraform.${env}.tfvars"

  if [[ ! -d "${env_dir}" ]]; then
    echo "Environment directory not found: ${env_dir}"
    exit 1
  fi

  if [[ ! -f "${var_file}" ]]; then
    echo "tfvars file not found: ${var_file}"
    exit 1
  fi

  if [[ "${env}" == "prod" && "${YES_PROD}" != true ]]; then
    read -r -p "You're destroying PROD resources. Continue? (yes/no): " confirm
    if [[ "${confirm}" != "yes" ]]; then
      echo "Cancelled prod destroy."
      exit 1
    fi
  fi

  echo "============================================================"
  echo "Destroying Terraform resources for environment: ${env}"
  echo "Environment dir: ${env_dir}"
  echo "Var file: ${var_file}"
  echo "============================================================"

  terraform -chdir="${env_dir}" init

  if [[ "${SKIP_PLAN}" != true ]]; then
    terraform -chdir="${env_dir}" plan -destroy -var-file="${var_file}"
  fi

  if [[ "${AUTO_APPROVE}" == true ]]; then
    terraform -chdir="${env_dir}" destroy -auto-approve -var-file="${var_file}"
  else
    terraform -chdir="${env_dir}" destroy -var-file="${var_file}"
  fi
}

case "${TARGET_ENV}" in
  dev|staging|prod)
    destroy_env "${TARGET_ENV}"
    ;;
  all)
    destroy_env "dev"
    destroy_env "staging"
    destroy_env "prod"
    ;;
  *)
    echo "Invalid environment: ${TARGET_ENV}"
    usage
    exit 1
    ;;
esac

echo "Terraform destroy flow completed."
