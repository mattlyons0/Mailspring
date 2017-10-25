import React from 'react';
import PropTypes from 'prop-types';
import { RetinaImg, Flexbox } from 'mailspring-component-kit';

class AppearanceModeSwitch extends React.Component {
  static displayName = 'AppearanceModeSwitch';

  static propTypes = {
    config: PropTypes.object.isRequired,
  };

  constructor(props) {
    super();
    this.state = {
      value: props.config.get('core.workspace.mode') +
      (props.config.get('core.workspace.mode') === 'list'?'':(props.config.get('core.workspace.splitMode').charAt(0).toUpperCase() + props.config.get('core.workspace.splitMode').slice(1))),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.config.get('core.workspace.mode'),
    });
  }

  _onApplyChanges = () => {
    AppEnv.commands.dispatch(`application:select-${this.state.value}-mode`);
  };

  _renderModeOptions() {
    return ['list', 'splitHoriz', 'splitVert'].map(mode => (
      <AppearanceModeOption
        mode={mode}
        key={mode}
        active={this.state.value === mode}
        onClick={() => this.setState({ value: mode })}
      />
    ));
  }

  render() {
    const hasChanges = this.state.value !== this.props.config.get('core.workspace.mode');
    let applyChangesClass = 'btn';
    if (!hasChanges) applyChangesClass += ' btn-disabled';

    return (
      <div className="appearance-mode-switch">
        <Flexbox direction="row" style={{ alignItems: 'center' }} className="item">
          {this._renderModeOptions()}
        </Flexbox>
        <div className={applyChangesClass} onClick={this._onApplyChanges}>
          Apply Layout
        </div>
      </div>
    );
  }
}

const AppearanceModeOption = function AppearanceModeOption(props) {
  let classname = 'appearance-mode';
  if (props.active) classname += ' active';

  const label = {
    list: 'Single Panel',
    splitHoriz: 'Two Panel',
    splitVert: 'Two Panel Vert.',
  }[props.mode];

  return (
    <div className={classname} onClick={props.onClick}>
      <RetinaImg name={`appearance-mode-${props.mode}.png`} mode={RetinaImg.Mode.ContentIsMask} />
      <div>{label}</div>
    </div>
  );
};
AppearanceModeOption.propTypes = {
  mode: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

class PreferencesAppearance extends React.Component {
  static displayName = 'PreferencesAppearance';

  static propTypes = {
    config: PropTypes.object,
    configSchema: PropTypes.object,
  };

  onClick = () => {
    AppEnv.commands.dispatch('window:launch-theme-picker');
  };

  render() {
    return (
      <div className="container-appearance">
        <label htmlFor="change-layout">Change layout:</label>
        <AppearanceModeSwitch id="change-layout" config={this.props.config} />
        <button className="btn btn-large" onClick={this.onClick}>
          Change theme...
        </button>
      </div>
    );
  }
}

export default PreferencesAppearance;
