import { _decorator, Camera, Canvas, CCFloat, clamp, Collider, Component, dynamicAtlasManager, EventMouse, geometry, Input, input, instantiate, inverseLerp, Node, PhysicsSystem, Prefab, RichText, Slider, Sprite, tween, Tween, UITransform, Vec3, Widget } from 'cc';
import { PowerSlide, SlideConfig } from './PowerSlide';
import { TargetBoard } from './TargetBoard';
import { PredefinedGuns } from './Data';
import { Target } from './Target';
import { ReloadingSprite } from './ReloadingSprite';
import { MissedEffect } from './MissedEffect';
import { PlayerControl } from './PlayerControl';
import { SelectionItem } from './SelectionItem';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component
{
	@property(PlayerControl)
	private playerControl: PlayerControl;
	@property(TargetBoard)
	private targetBoard: TargetBoard;
	@property(Node)
	private weaponCollection: Node;
	@property(Node)
	private mainGameUI: Node;
	@property(RichText)
	private readySetGo: RichText;
	@property(RichText)
	private scoreText: RichText;

	private _transiting: boolean = false;
	private _inGame: boolean;
	private _score: number;

	private _weaponSelectionTween: Tween<Node>;
	private _readySetGoTween: Tween<Node>;

	protected start(): void
	{
		this.mainGameUI.active = false;

		this._inGame = true;
		this.showWeapons();
	}

	public onBackButton()
	{
		if (this._inGame)
		{
			this.endGame();
		}
	}

	public onConfirmWeapon(item: SelectionItem)
	{
		console.log(this._inGame + "||" + this._transiting);
		if (this._inGame || this._transiting)
		{
			return;
		}

		this.playerControl.setGun(item.getGun());
		this.startGame();
	}

	public addScore(score: number)
	{
		this.setScore(this._score + score);
	}

	public setScore(score: number)
	{
		this._score = score;
		this.scoreText.string = "<color=#000000>Score\n" + this._score + "</color>";
	}

	private showWeapons()
	{
		if (this._inGame && !this._transiting)
		{
			if (this._weaponSelectionTween != null)
			{
				this._weaponSelectionTween.stop();
			}
		
			this._transiting = true;
			this.mainGameUI.active = false;
			this._weaponSelectionTween = tween(this.weaponCollection).to(0.5, { position: new Vec3(0, 0, 0) }, {
				easing: "backOut",
				onComplete: (target) => {
					this._transiting = false;
				}
			}).start();

			this._inGame = false;
			this.targetBoard.stopBoard();
			this.playerControl.disableGunControl();
		}
	}

	private hideWeapons()
	{
		if (!this._inGame && !this._transiting)
		{
			if (this._weaponSelectionTween != null) {
				this._weaponSelectionTween.stop();
			}
			
			this._transiting = true;
			this._weaponSelectionTween = tween(this.weaponCollection).to(0.5, { position: new Vec3(0, -600, 0) }, {
				easing: "backIn",
				onComplete: (target) =>
				{
					this._inGame = true;
					this._transiting = false;
					this.playReadySetGo();
				}
			}).start();
		}
	}

	private playReadySetGo()
	{
		this.mainGameUI.active = true;

		let dummy = { dum: 0 };

		let rd = this.readySetGo;
		this.readySetGo.node.active = true;

		let time = 2.5;
		rd.string = "<color=#000000>Ready...</color>"
		tween(dummy).to(2.5 / 3, { dum: 1 })
			.call(() => rd.string = "<color=#000000>Set...</color>")
			.to(2.5 / 3, { dum: 1 })
			.call(() => rd.string = "<color=#000000>Go...</color>")
			.to(2.5 / 3, { dum: 1 })
			.call(() =>
			{
				// console.log("aaa");
				this.readySetGo.node.active = false;
				
				this.targetBoard.activateBoard();
				this.playerControl.allowGunControl();
			}).start();
	}

	private startGame()
	{
		this.setScore(0);
		this.hideWeapons();
	}

	private endGame()
	{
		this.showWeapons();
	}
}

