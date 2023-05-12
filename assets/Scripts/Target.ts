import { _decorator, Button, CCFloat, Collider, Collider2D, Component, Node, randomRange, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Target')
export class Target extends Component
{
    @property(Node)
    private targetSpringBoard: Node;
    @property(Collider)
    private topCollider: Collider;
    @property(Collider)
    private bottomCollider: Collider;

    @property({ type: CCFloat })
    private springTime: number;
    @property({ type: CCFloat })
    private lowerTime: number;
    @property({ type: CCFloat })
    private shotLowerTime: number;

    private _isShown: boolean;
    private _isShot: boolean;
    private _hitTop: boolean;
    private _tween: Tween<Node> = null;

    public get isShot(): boolean
    {
        return this._isShot;
    }

    public get isShown(): boolean
    {
        return this._isShown;
    }

    public get scoreForHit(): number
    {
        return this._isShot ? (this._hitTop ? 300 : 100) : 0;
    }

    protected start()
    {
        this.targetSpringBoard.setRotationFromEuler(-90, 0, 0);
        this._isShown = false;
        this.topCollider.enabled = false;
        this.bottomCollider.enabled = false;
        // this.debugSpringAndLower(randomRange(1, 2));
    }

    public springBoard()
    {
        if (this._tween !== null)
        {
            this._tween.stop();
        }
        
        this._isShot = false;
        this._tween = this.getSpringTween();
        this._tween.start();
    }

    public onBoardShot(hitTop: boolean)
    {
        this._hitTop = this._hitTop || hitTop;
        this._isShot = true;
        this.lowerBoard();
    }

    public lowerBoard()
    {
        if (this._tween !== null)
        {
            this._tween.stop();
        }

        this._tween = this.getLowerTween();
        this._tween.start();
    }

    private getSpringTween(): Tween<Node>
    {
        return tween(this.targetSpringBoard)
            .to(this.springTime, { eulerAngles: new Vec3(0, 0, 0) },
                {
                    easing: "bounceOut",
                    onUpdate: (target, ratio) =>
                    {
                        if (ratio >= 0.75)
                        {
                            this.topCollider.enabled = true;
                            this.bottomCollider.enabled = true;
                        }
                    },
                    onComplete: (target) =>
                    {
                        this._isShown = true;
                        this.topCollider.enabled = true;
                        this.bottomCollider.enabled = true;
                        this._tween = null;
                    },
                });
    }

    private getLowerTween(): Tween<Node>
    {
        return tween(this.targetSpringBoard)
            .to(this._isShot ? this.shotLowerTime : this.lowerTime, { eulerAngles: new Vec3(-90, 0, 0) },
                {
                    easing: this._isShot ? "linear" : "bounceIn",
                    onStart: (target) =>
                    {
                        this._isShown = false;
                        this.topCollider.enabled = false;
                        this.bottomCollider.enabled = false;
                        this._tween = null;
                    }
                });
    }

    private debugSpringAndLower(delay: number)
    {
        let delayTween = tween(this.targetSpringBoard)
            .to(delay, {});
        tween(this.targetSpringBoard).sequence(this.getSpringTween(), delayTween, this.getLowerTween(), delayTween).repeatForever().start();
    }
}

