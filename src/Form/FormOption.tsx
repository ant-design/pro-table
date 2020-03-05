import React from 'react';
import { FormInstance } from 'antd/es/form';
import { Button } from 'antd';
import { SearchConfig } from './index';

export interface FormOptionProps {
  searchConfig: SearchConfig;
  type?: 'form' | 'list' | 'table' | 'cardList' | undefined;
  form: FormInstance;
  submit: () => void;
  collapse: boolean;
  setCollapse: (collapse: boolean) => void;
  showCollapseButton: boolean;
}

/**
 * FormFooter 的组件，可以自动进行一些配置
 * @param props
 */
const FormOption: React.FC<FormOptionProps> = props => {
  const { searchConfig, setCollapse, collapse, type, form, submit, showCollapseButton } = props;
  const isForm = type === 'form';
  const { searchText, submitText, resetText, collapseRender, optionRender } = searchConfig;
  if (optionRender === false) {
    return null;
  }
  if (optionRender) {
    return <>{optionRender(searchConfig, props)}</>;
  }
  return (
    <>
      <Button type="primary" htmlType="submit" onClick={() => submit()}>
        {isForm ? submitText : searchText}
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        onClick={() => {
          form.resetFields();
          if (!isForm) {
            submit();
          }
        }}
      >
        {resetText}
      </Button>
      {!isForm && showCollapseButton && (
        <a
          style={{ marginLeft: 8 }}
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          {collapseRender && collapseRender(collapse)}
        </a>
      )}
    </>
  );
};

export default FormOption;
