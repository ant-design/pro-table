import React, { useEffect, useState } from 'react';
import { Icon, Tooltip } from 'antd';

const FullScreenIcon = () => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  useEffect(() => {
    document.onfullscreenchange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
  }, []);
  return fullscreen ? (
    <Tooltip
      title="退出全屏"
      getPopupContainer={() =>
        ((document.getElementById('ant-design-pro-table') || document.body) as any) as HTMLElement
      }
    >
      <Icon type="fullscreen-exit" />
    </Tooltip>
  ) : (
    <Tooltip
      title="全屏"
      getPopupContainer={() =>
        ((document.getElementById('ant-design-pro-table') || document.body) as any) as HTMLElement
      }
    >
      <Icon type="fullscreen" />
    </Tooltip>
  );
};

export default FullScreenIcon;
