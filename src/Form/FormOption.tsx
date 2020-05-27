import React from 'react';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Button } from 'antd';
import { ProTableTypes } from '../Table';
import { SearchConfig } from './index';

export interface FormOptionProps {
  searchConfig: SearchConfig;
  type?: ProTableTypes;
  form: FormComponentProps['form'] & { submit: () => void };
  submit: () => void;
  collapse: boolean;
  setCollapse: (collapse: boolean) => void;
  showCollapseButton: boolean;
  onReset?: () => void;
}

/**
 * FormFooter 的组件，可以自动进行一些配置
 * @param props
 */
const FormOption: React.FC<FormOptionProps> = (props) => {
  const {
    searchConfig,
    setCollapse,
    collapse,
    type,
    form,
    submit,
    showCollapseButton,
    onReset = () => {},
  } = props;
  const isForm = type === 'form';
  const { searchText, submitText, resetText, collapseRender, optionRender } = searchConfig;
  if (optionRender === false) {
    return null;
  }
  if (optionRender) {
    return <>{optionRender(searchConfig, props)}</>;
  }
  return (
    <React.Fragment>
      <Button
        onClick={() => {
          form.resetFields();
          onReset();
          if (!isForm) {
            submit();
          }
        }}
        style={{
          marginRight: 8,
        }}
      >
        {resetText}
      </Button>{' '}
      <Button
        type="primary"
        htmlType="submit"
        onClick={() => submit()}
        style={{
          marginRight: 8,
        }}
      >
        {isForm ? submitText : searchText}
      </Button>
      {!isForm && showCollapseButton && (
        <a
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          {collapseRender && collapseRender(collapse)}
        </a>
      )}
    </React.Fragment>
  );
};

export default FormOption;
