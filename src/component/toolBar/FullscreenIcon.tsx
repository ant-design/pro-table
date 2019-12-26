import React, { useEffect, useState } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useIntl } from '../intlContext';

const FullScreenIcon = () => {
  const intl = useIntl();
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  useEffect(() => {
    document.onfullscreenchange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
  }, []);
  return fullscreen ? (
    <Tooltip
      title={intl.getMessage('tableToolBar.exitFullScreen', '全屏')}
      getPopupContainer={() =>
        ((document.getElementById('ant-design-pro-table') || document.body) as any) as HTMLElement
      }
    >
      <FullscreenExitOutlined />
    </Tooltip>
  ) : (
    <Tooltip
      title={intl.getMessage('tableToolBar.fullScreen', '全屏')}
      getPopupContainer={() =>
        ((document.getElementById('ant-design-pro-table') || document.body) as any) as HTMLElement
      }
    >
      <FullscreenOutlined />
    </Tooltip>
  );
};

export default FullScreenIcon;
