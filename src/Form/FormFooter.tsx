import React from 'react';
import { FormInstance } from 'antd/es/form';
import { Button } from 'antd';
import { SearchConfig } from './index';

interface FormFooterProps {
  searchConfig: SearchConfig;
  type?: 'form' | 'list' | 'table' | 'cardList' | undefined;
  form: FormInstance;
  submit: () => void;
  collapse: boolean;
  setCollapse: (collapse: boolean) => void;
  showCollapseButton: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({
  searchConfig,
  setCollapse,
  collapse,
  type,
  form,
  submit,
  showCollapseButton,
}) => {
  const isForm = type === 'form';
  const { searchText, submitText, resetText, collapseRender } = searchConfig;
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

export default FormFooter;
